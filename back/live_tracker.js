import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

const lockfilePath = path.join(process.env.LOCALAPPDATA, 'Riot Games', 'Riot Client', 'Config', 'lockfile');

fs.readFile(lockfilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("❌ No se pudo leer el lockfile. ¿Está Valorant abierto?");
        return;
    }

    const [name, pid, port, password, protocol] = data.split(':');
    console.log(`🔌 Conectando al Websocket local en el puerto ${port}...`);

    const wsUrl = `wss://127.0.0.1:${port}`;
    const authHeader = 'Basic ' + Buffer.from(`riot:${password}`).toString('base64');

    const ws = new WebSocket(wsUrl, {
        headers: { Authorization: authHeader },
        rejectUnauthorized: false
    });

    ws.on('open', () => {
        console.log("✅ ¡Conectado! Filtrando el ruido social y escuchando el juego...");
        ws.send(JSON.stringify([5, 'OnJsonApiEvent']));
    });

    ws.on('message', (data) => {
        const message = data.toString();

        if (message.includes('OnJsonApiEvent') && message.length > 20) {
            try {
                const parsed = JSON.parse(message);
                const uri = parsed[2].uri;
                const eventData = parsed[2].data;

                // 1. FILTRO ANTISPAM: Ignoramos amigos, notificaciones y heartbeats
                if (uri.includes('/social/') || uri.includes('/chatbox/') || uri.includes('/product-session/')) {
                    return;
                }

                // 2. EXTRAER DATOS OCULTOS DE LA PARTIDA
                if (uri === '/chat/v4/presences' && eventData && eventData.presences) {
                    // Buscar la primera presencia que tenga datos privados (normalmente la tuya o de la sala)
                    const presenciaConDatos = eventData.presences.find(p => p.private);

                    if (presenciaConDatos) {
                        // Decodificar el Base64 que manda Riot
                        const decodedStr = Buffer.from(presenciaConDatos.private, 'base64').toString('utf8');
                        const gameState = JSON.parse(decodedStr);

                        // Solo imprimir si estamos realmente dentro de una partida o pregame
                        if (gameState.sessionLoopState === "INGAME") {
                            console.log(`\n🏆 MARCADOR EN VIVO: Aliados ${gameState.partyOwnerMatchScoreAllyTeam} - ${gameState.partyOwnerMatchScoreEnemyTeam} Enemigos`);
                            console.log(`🗺️  Mapa: ${gameState.matchMap.split('/').pop()}`);
                        }
                    }
                } else {
                    // Imprimir otros eventos core del juego que no hemos filtrado
                    console.log(`\n🎯 EVENTO CORE: ${uri}`);
                }

            } catch (e) {
                // Silenciamos errores menores de parseo
            }
        }
    });

    ws.on('error', (error) => console.error("❌ Error en WSS:", error.message));
});