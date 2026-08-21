import fs from 'fs';

const DICTIONARY_AGENTS = {
    "add6443a-41bd-e414-f6ad-e58d267f4e95": "Jett",
    "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc": "Reyna",
    "22697a3d-45bf-8dd7-4fec-84a9e28c69d7": "Chamber",
    "dade69b4-4f5a-8528-247b-219e5a1facd6": "Fade",
    "41fb69c1-4189-7b37-f117-bcaf1e96f1bf": "Astra",
    "707eab51-4836-f488-046a-cda6bf494859": "Viper",
    "efba5359-4016-a1e5-7626-b1ae76895940": "Vyse",
    "f94c3b30-42be-e959-889c-5aa313dba261": "Raze",
    "601dbbe7-43ce-be57-2a40-42a2ef2d7601": "Killjoy",
    "e370fa57-4757-3604-36a7-67844a54d961": "Omen",
    "320b2a48-4d9b-a075-30f1-1193a1e5163a": "Breach"
};

console.log("=========================================================================");
console.log("🔍 [CHIVATO DE IDs] Extrayendo sujetos para el Diccionario ERP...");
console.log("=========================================================================");

try {
    const rawData = fs.readFileSync("./extractor/partida_REAL_aeb1a8e6-0381-458e-b973-1ea1c8fbff44.json", "utf-8");
    const matchData = JSON.parse(rawData);

    // Separamos por bandos para que encuentres a tus 5 jugadoras del tirón
    const bandoAzul = [];
    const bandoRojo = [];

    matchData.players.forEach((p) => {
        const agentIdRaw = p.characterId ? p.characterId.toLowerCase() : "";
        const nombreAgente = DICTIONARY_AGENTS[agentIdRaw] || `Desconocido (${agentIdRaw.substring(0,5)})`;
        const infoJugador = {
            agente: nombreAgente,
            idPlayer: p.subject
        };

        if (p.teamId === "Blue") bandoAzul.push(infoJugador);
        else bandoRojo.push(infoJugador);
    });

    console.log("\n🟦 BANDO AZUL (Tu equipo):");
    console.log("-------------------------------------------------------------------------");
    bandoAzul.forEach(j => {
        console.log(`🤖 Agente: ${j.agente.padEnd(10)} | 🔑 ID: "${j.idPlayer}"`);
    });

    console.log("\n🟥 BANDO ROJO (Rivales):");
    console.log("-------------------------------------------------------------------------");
    bandoRojo.forEach(j => {
        console.log(`🤖 Agente: ${j.agente.padEnd(10)} | 🔑 ID: "${j.idPlayer}"`);
    });
    console.log("\n=========================================================================");

} catch (e) {
    console.log("❌ Error al leer el archivo JSON:", e);
}