import fs from 'fs';
import path from 'path';

// Ruta exacta del log de Valorant en tu PC
const logPath = path.join(process.env.LOCALAPPDATA, 'VALORANT', 'Saved', 'Logs', 'ShooterGame.log');

console.log("📖 Iniciando el Lector de Logs de Valorant...");

if (!fs.existsSync(logPath)) {
    console.error(`❌ No se encontró el archivo log en: ${logPath}`);
    console.error("Asegúrate de haber abierto Valorant al menos una vez.");
    process.exit(1);
}

// Empezamos a leer desde el final del archivo actual
let fileSize = fs.statSync(logPath).size;

console.log(`✅ Escuchando el archivo ShooterGame.log en tiempo real...`);

// Vigilamos los cambios en el archivo
fs.watchFile(logPath, { interval: 100 }, (curr, prev) => {
    // Si el archivo ha crecido, leemos la parte nueva
    if (curr.size > prev.size) {
        const stream = fs.createReadStream(logPath, {
            encoding: 'utf8',
            start: prev.size,
            end: curr.size
        });

        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            const lines = data.split('\n');
            lines.forEach(line => {
                if (line.trim() === '') return;

                // --------------------------------------------------------
                // 🔍 FILTRO MÁGICO 2.0: Combate total y Coordenadas
                // --------------------------------------------------------

                const lowerLine = line.toLowerCase();

                // 1. DAÑO Y MUERTES ESTÁNDAR
                if (lowerLine.includes('authtakedamage') || lowerLine.includes('killedby') || lowerLine.includes('died')) {
                    console.log(`🩸 DAÑO/KILL: ${line.trim()}`);
                }

                // 2. DISPAROS Y ARMAS
                else if (lowerLine.includes('logshooterweapon') || lowerLine.includes('fireprojectile')) {
                    console.log(`🔫 DISPARO: ${line.trim()}`);
                }

                // 3. COORDENADAS (El mapa de calor / Heatmap)
                // Riot suele registrar transformaciones de los peones (Pawn) o la Spike
                else if (lowerLine.includes('logshootercharacter') && lowerLine.includes('teleport')) {
                    console.log(`📍 POSICIÓN (Spawn/TP): ${line.trim()}`);
                }

                // 4. ESTADO DE LA RONDA (Plantadas, defuses, victorias)
                else if (lowerLine.includes('logshootergamerules') || lowerLine.includes('roundstate')) {
                    console.log(`⏱️ ESTADO RONDA: ${line.trim()}`);
                }
            });
        });
    } else if (curr.size < prev.size) {
        // Si el archivo es más pequeño, es que el juego lo ha reiniciado (Pasa al abrir el juego)
        console.log("🔄 El juego ha reiniciado el archivo Log.");
        fileSize = curr.size;
    }
});