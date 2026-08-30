import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

const targetFolder = process.argv[2] || process.cwd();

const VANTAGE_LOG_DIR = path.join(process.env.LOCALAPPDATA, 'Vantage', 'collector', 'Logs');
if (!fs.existsSync(VANTAGE_LOG_DIR)) {
    try {
        fs.mkdirSync(VANTAGE_LOG_DIR, { recursive: true });
    } catch (e) {
        console.error("❌ Error crítico al crear el directorio de logs:", e.message);
    }
}

const COLLECTOR_LOG_FILE = path.join(VANTAGE_LOG_DIR, 'collector.log');

function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    console.log(message);
    try {
        fs.appendFileSync(COLLECTOR_LOG_FILE, logLine);
    } catch (e) {
        console.error("❌ Error escribiendo en el archivo de log interno:", e.message);
    }
}

const LOCKFILE_PATH = path.join(process.env.LOCALAPPDATA, 'Riot Games', 'Riot Client', 'Config', 'lockfile');

function getLockfileData() {
    try {
        const lockfile = fs.readFileSync(LOCKFILE_PATH, 'utf8');
        const parts = lockfile.split(':');
        return { port: parts[2], password: parts[3], protocol: parts[4] };
    } catch (error) {
        writeLog(`❌ Error detallado leyendo el lockfile: ${error.message} (Stack: ${error.stack})`);
        return null;
    }
}

async function runCollector() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    writeLog("🚀 Iniciando Colector Spy (Excepciones Robustas)...");
    writeLog(`📁 Carpeta de trabajo: ${targetFolder}`);

    const credentials = getLockfileData();
    if (!credentials) {
        writeLog("❌ Cliente no detectado: Imposible continuar sin lockfile.");
        return;
    }

    const authHeader = 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64');
    let myPuuid = "";
    let lastState = "";
    let isSpyingPostGame = false;

    try {
        const res = await fetch(`https://127.0.0.1:${credentials.port}/chat/v1/session`, { headers: { Authorization: authHeader } });
        if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);
        const sessionJson = await res.json();
        myPuuid = sessionJson.puuid;
        writeLog("👤 PUUID cacheado correctamente.");

        const partyRes = await fetch(`https://127.0.0.1:${credentials.port}/chat/v4/presences`, { headers: { Authorization: authHeader } });
        if (!partyRes.ok) throw new Error(`HTTP error status: ${partyRes.status}`);
        const partyJson = await partyRes.json();
        const presences = partyJson.presences;
        const myPresence = presences.find(p => p.puuid === myPuuid);
        
        if (myPresence && myPresence.private) {
            const decoded = JSON.parse(Buffer.from(myPresence.private, 'base64').toString('utf-8'));
            writeLog(`📸 [BASELINE] Estado inicial de la sala guardado: ${decoded.matchPresenceData?.sessionLoopState || 'Desconocido'}`);
            
            const lobbyFile = path.join(targetFolder, `vantage_lobby_${Date.now()}.json`);
            fs.writeFileSync(lobbyFile, JSON.stringify(decoded, null, 2));
        }
    } catch (e) {
        writeLog(`⚠️ Excepción detallada en la captura baseline: ${e.message} | Stack: ${e.stack}`);
    }

    const wsUrl = `wss://riot:${credentials.password}@127.0.0.1:${credentials.port}`;
    const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

    ws.on('open', () => {
        writeLog("🔌 [WebSocket] Escuchando la sesión de juego...");
        ws.send(JSON.stringify([5, "OnJsonApiEvent"])); 
    });

    ws.on('message', async (data) => {
        const msg = data.toString();
        if (msg.length < 20) return;

        try {
            const parsed = JSON.parse(msg);
            if (!parsed[2] || !parsed[2].uri) return;
            
            const uri = parsed[2].uri;
            const eventData = parsed[2].data;

            if (uri === '/chat/v4/presences' && eventData?.presences) {
                const myPresence = eventData.presences.find(p => p.puuid === myPuuid);
                if (myPresence && myPresence.private) {
                    const decoded = JSON.parse(Buffer.from(myPresence.private, 'base64').toString('utf-8'));
                    const currentState = decoded.matchPresenceData?.sessionLoopState;

                    if (currentState && currentState !== lastState) {
                        writeLog(`🔄 [ESTADO] ➔ ${currentState}`);

                        if (lastState === "INGAME" && (currentState === "MENUS" || currentState === "POSTGAME")) {
                            writeLog("🏁 [PARTIDA FINALIZADA] Abriendo ventana de intercepción (10s)...");
                            isSpyingPostGame = true;
                            setTimeout(() => {
                                isSpyingPostGame = false;
                                writeLog("🛑 [SPY] Ventana de intercepción cerrada.");
                            }, 10000);
                        }
                        lastState = currentState;
                    }
                }
            }

            if (isSpyingPostGame) {
                if (!uri.includes('/social/') && !uri.includes('/chat/') && !uri.includes('/keystone/')) {
                    writeLog(`📦 [INTERCEPTADO] URI: ${uri}`);
                    
                    if (uri.includes('/match-details/') || uri.includes('/post-game/') || uri.includes('/matches/')) {
                        const fileName = `vantage_payload_${Date.now()}.json`;
                        const filePath = path.join(targetFolder, fileName);
                        fs.writeFileSync(filePath, JSON.stringify(eventData, null, 2));
                        writeLog(`🏆 [¡BINGO!] Payload de partida guardado en: ${filePath}`);
                    }
                }
            }
        } catch (e) {
            writeLog(`⚠️ Excepción al parsear mensaje de WebSocket: ${e.message} | Mensaje bruto: ${msg.substring(0, 100)}...`);
        }
    });

    ws.on('error', (error) => {
        writeLog(`❌ Error crítico en WebSocket: ${error.message} | Stack: ${error.stack}`);
    });

    ws.on('close', () => {
        writeLog("⚠️ Conexión WebSocket cerrada con el cliente.");
    });
}

runCollector();