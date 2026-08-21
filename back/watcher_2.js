import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';

const PATH_TO_WATCH = './back/extractor';

console.log(`👀 Vigilando carpeta: ${PATH_TO_WATCH}...`);

watch(PATH_TO_WATCH, (eventType, filename) => {
    // IGNORAR el archivo que genera el parser y el de salida
    if (filename === 'pracc_analizada_bbdd.json' || filename === 'partida_pracc_actual.json') {
        return; 
    }
    
    if (filename && filename.endsWith('.json')) {
        console.log(`\n🚀 Nueva partida detectada: ${filename}.`);
        // ... resto de tu código
    }
});