import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function setupManager() {
    console.clear();
    console.log("==================================================");
    console.log("🟢 VANTAGE MANAGER - PANEL DE CONTROL DE PRACCS 🟢");
    console.log("==================================================\n");

    const lockfile_path = path.join(process.env.LOCALAPPDATA, 'Riot Games', 'Riot Client', 'Config', 'lockfile');

    if (!fs.existsSync(lockfile_path)) {
        console.error("❌ ERROR: No se detecta Valorant abierto. Abre el juego antes de iniciar el colector.");
        process.exit(1);
    }

    console.log("✅ Cliente de Valorant detectado en el sistema.");

    rl.question('📁 ¿En qué carpeta quieres guardar los registros de la pracc? (Enter para usar la actual): ', (savePath) => {
        const finalPath = savePath.trim() === "" ? process.cwd() : savePath.trim();

        console.log(`\n✅ Destino configurado en: ${finalPath}`);
        console.log("🚀 Lanzando el colector invisible en segundo plano...\n");
        console.log("--------------------------------------------------");

        startCollectorProcess(finalPath);
    });
}

function startCollectorProcess(targetFolder) {
    const collectorPath = path.join(__dirname, 'collector.js');

    // Eliminamos shell: true para limpiar el warning y pasamos el targetFolder
    const collectorProcess = spawn('node', [collectorPath, targetFolder], {
        stdio: 'inherit'
    });

    collectorProcess.on('close', (code) => {
        console.log(`\n⚠️ El colector finalizó con el código de salida: ${code}`);
        rl.close();
    });

    process.on('SIGINT', () => {
        console.log("\n🛑 Deteniendo Vantage Manager y cerrando colectores...");
        collectorProcess.kill();
        process.exit(0);
    });
}

setupManager();