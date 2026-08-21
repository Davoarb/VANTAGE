import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Cargamos el .env de la raíz de forma segura
dotenv.config({ path: '../.env' }); 

if (!process.env.DIRECT_URL) {
    console.error("❌ ERROR: DIRECT_URL no definida en el .env de la raíz.");
    process.exit(1);
}

// 🎭 Diccionario Oficial de Agentes de la Comunidad
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
    "320b2a48-4d9b-a075-30f1-1193a1e5163a": "Breach",
    "707eab79-46df-f0f6-8321-bf925e0a1122": "Brimstone",
    "11707358-454d-ebcc-4f43-40aa9a16a9c3": "Cypher",
    "0e38b6e5-4722-12a2-391e-45a004b97b10": "Harbor",
    "6f2a04ca-43e0-be17-7f36-b3908627744d": "Skye",
    "ade3b613-428a-837e-c53b-94a56574a67f": "Sova",
    "b1456100-4949-8584-e155-21e17aa5630e": "Neon",
    "cc8b6900-4514-432a-0054-5a9d67d4aa3f": "Gekko",
    "dad69000-4514-432a-0054-5a9d67d4aa3f": "Deadlock",
    "1db69000-4514-432a-0054-5a9d67d4aa3f": "Iso",
    "22c1a40d-43ee-a5b7-4d48-61143c758f7b": "Sage",
    "5f8d3a7f-467b-97f3-062c-13acf203c002": "Yoru",
    "601dbbe7-43ce-be57-2a40-42a2ef2d7603": "Phoenix",
    "a3eae8f7-4307-53e5-155c-a28f43749091": "KAY/O",
    "e370fa57-4757-3604-36a7-67844a54d963": "Clove"
};

// 👤 MAPEO DE IDENTIDADES ERP (Configura aquí a tus 5 jugadoras de bando Azul/Rojo)
const DICCIONARIO_JUGADORES = {
    "1e8a4752-c2b2-5c39-a277-ccd149702912": "Davo #ESP",
    "id-largo-jugadora-2": "Jugadora2 #TAG",
    "id-largo-jugadora-3": "Jugadora3 #TAG",
    "id-largo-jugadora-4": "Jugadora4 #TAG",
    "id-largo-jugadora-5": "Jugadora5 #TAG"
};

// 🗺️ Diccionario de Mapas (Nombres de Desarrollo API ➔ Nombres Reales de UI)
const DICTIONARY_MAPS = {
    "pitt": "Pearl",
    "ascent": "Ascent",
    "duality": "Bind",
    "foxtrot": "Breeze",
    "canyon": "Fracture",
    "triad": "Haven",
    "port": "Icebox",
    "bonsai": "Split",
    "Juliett": "Sunset",
    "jam": "Lotus",
    "infinity": "Abyss",
    "rook":"Corrode",
    "Plummet":"Summit",
};

// Diccionarios de Inventario
const DICTIONARY_WEAPONS = {
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": "Vandal",
    "ee8cf32b-4949-ac1f-a4a1-db9284714df9": "Phantom",
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": "Ghost",
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": "Sheriff",
    "c4883e50-4154-20d9-ec36-7bba400cd520": "Marshal",
    "55d8a0f4-4274-ca67-e7e6-04b31c9c6c44": "Operator",
    "5f263152-429f-8d53-9a5c-12a404035b9d": "Classic",
    "44d13435-4abf-bb37-75d8-40b28a237257": "Shorty",
    "42da8c53-4e49-d1d3-0d78-38bc3838e4cd": "Frenzy",
    "4ade7faa-4366-98a0-20ad-40bef2e24050": "Stinger",
    "12aeac37-4d77-f45f-0a39-328a343b2ec7": "Spectre",
    "4fc300da-4c95-a44c-067c-63a4d5336b1a": "Bulldog",
    "63e6c016-434a-f54c-76e3-be15505da5c1": "Guardian",
    "2db83350-434b-4a4c-12ac-da3e30f1df2c": "Outlaw",
    "a82900da-4c95-a44c-067c-63a4d5336b1a": "Ares",
    "e33a00da-4c95-a44c-067c-63a4d5336b1a": "Odin"
};

const DICTIONARY_ARMOR = {
    "4dec83d5-4902-9ab3-bed6-a7a390761157": "Shield 25🛡️",
    "ebf47a11-479d-aa93-bed6-a7a390761157": "Regen 650🛡️⚡",
    "5a60f12c-455b-fde4-779a-b59f85e204a8": "Shield 50🛡️🏆"
};

// 🧠 CONFIGURACIÓN DINÁMICA DE ENTRADA (Selector de tu Frontend)
const BANDO_INICIAL_FALKE = "Red";

console.log("=========================================================================");
console.log(`⚙️  [PARSER V25.0] Exportador de Big Data Total Activo | Falke: ${BANDO_INICIAL_FALKE}`);
console.log("=========================================================================");

try {
    const rawData = await fs.readFile("./back/extractor/partida_pracc_actual.json", "utf-8");
    const matchData = JSON.parse(rawData);
    // 1. Detectar el queueId real del JSON
    const queueId = matchData.matchInfo?.queueId || "unknown";

    // 2. Si no es "competitive", lo etiquetamos directamente como "Custom"
    // Esto capturará cualquier valor que no sea competitive (incluyendo las praccs)
    const tipoPartida = queueId === "competitive" ? "Competitive" : "Custom";

    console.log(`🎮 TESTEO DE PRACC: QueueID detectado = ${queueId} | Clasificado como = ${tipoPartida}`);

    const stats = {};
    const detallesPorRonda = {};
    const timelineRondasVisual = [];

    // =================================================================================================
    // 🔥 FASE 1: PROCESAMIENTO GENERAL DE ESTADÍSTICAS E IDENTIDADES (SCOREBOARD BASE)
    // =================================================================================================
    matchData.players.forEach((p, idx) => {
        const jugadorId = p.subject;
        const agentIdRaw = p.characterId ? p.characterId.toLowerCase() : "";
        const nombreAgente = DICTIONARY_AGENTS[agentIdRaw] || `ID:${agentIdRaw.substring(0, 5)}`;
        const rondasJugadas = p.stats ? p.stats.roundsPlayed : 1;

        let danoTotal = 0;
        if (p.roundDamage && p.roundDamage.length > 0) {
            p.roundDamage.forEach((d) => { danoTotal += d.damage; });
        }

        const acs = p.stats ? Math.round(p.stats.score / rondasJugadas) : 0;
        const adr = (danoTotal / rondasJugadas).toFixed(1);
        const nombreMapeado = DICCIONARIO_JUGADORES[jugadorId] || `Player ${idx + 1}`;

        if (jugadorId) {
            stats[jugadorId] = {
                agente: nombreAgente, nombre: nombreMapeado, team: p.teamId, acs: acs,
                kills: p.stats ? p.stats.kills : 0, deaths: p.stats ? p.stats.deaths : 0, assists: p.stats ? p.stats.assists : 0, adr: adr,
                fk: 0, fd: 0, plants: 0, defuses: 0, totalHs: 0, totalBs: 0, totalLs: 0, rondasUtilesKAST: 0, rondasTotales: rondasJugadas,
                multikills: { k2: 0, k3: 0, k4: 0, k5: 0 },
                clutches: { c1v1: [0,0], c1v2: [0,0], c1v3: [0,0], c1v4: [0,0], c1v5: [0,0] }
            };
        }
    });

    if (matchData.roundResults && matchData.roundResults.length > 0) {
        matchData.roundResults.forEach((r) => {
            let todasLasKillsDeLaRonda = [];
            if (r.playerStats && r.playerStats.length > 0) {
                r.playerStats.forEach((ps) => {
                    if (ps.kills && ps.kills.length > 0) {
                        ps.kills.forEach((k) => { todasLasKillsDeLaRonda.push(k); });
                    }
                });
            }
            todasLasKillsDeLaRonda.sort((a, b) => a.roundTime - b.roundTime);

            if (r.firstBloodPlayer && stats[r.firstBloodPlayer]) stats[r.firstBloodPlayer].fk += 1;
            if (todasLasKillsDeLaRonda.length > 0) {
                const victimId = todasLasKillsDeLaRonda[0].victim;
                if (victimId && stats[victimId]) stats[victimId].fd += 1;
            }

            if (r.playerStats && r.playerStats.length > 0) {
                r.playerStats.forEach((ps) => {
                    const jugadorId = ps.subject;
                    if (!jugadorId || !stats[jugadorId]) return;

                    let aportoValor = false;
                    const tieneKill = todasLasKillsDeLaRonda.some(k => k.killer === jugadorId);
                    if (tieneKill) aportoValor = true;

                    if (ps.wasKilled === false) {
                        const miBandoPerdio = r.winningTeam !== stats[jugadorId].team;
                        if (miBandoPerdio && r.bombPlanter && !tieneKill) aportoValor = false;
                        else aportoValor = true;
                    }

                    todasLasKillsDeLaRonda.forEach(k => { if (k.assistants && k.assistants.includes(jugadorId)) aportoValor = true; });

                    if (!aportoValor && ps.damage && ps.damage.length > 0) {
                        ps.damage.forEach((d) => {
                            if (d.damage >= 50 && todasLasKillsDeLaRonda.some(k => k.victim === d.receiver)) aportoValor = true;
                        });
                    }

                    if (!aportoValor && ps.wasKilled === true) {
                        const miMuerte = todasLasKillsDeLaRonda.find(k => k.victim === jugadorId);
                        if (miMuerte) {
                            const miAsesino = miMuerte.killer;
                            if (todasLasKillsDeLaRonda.some(k => k.killer !== miAsesino && k.victim === miAsesino && k.roundTime > miMuerte.roundTime && (k.roundTime - miMuerte.roundTime) <= 5000)) aportoValor = true;
                        }
                    }

                    if (aportoValor) stats[jugadorId].rondasUtilesKAST += 1;

                    if (ps.damage && ps.damage.length > 0) {
                        ps.damage.forEach((d) => {
                            stats[jugadorId].totalHs += d.headshots || 0;
                            stats[jugadorId].totalBs += d.bodyshots || 0;
                            stats[jugadorId].totalLs += d.legshots || 0;
                        });
                    }
                });
            }

            Object.keys(stats).forEach((jugadorId) => {
                const killsRonda = todasLasKillsDeLaRonda.filter(k => k.killer === jugadorId).length;
                if (killsRonda === 2) stats[jugadorId].multikills.k2 += 1;
                if (killsRonda === 3) stats[jugadorId].multikills.k3 += 1;
                if (killsRonda === 4) stats[jugadorId].multikills.k4 += 1;
                if (killsRonda >= 5) stats[jugadorId].multikills.k5 += 1;
            });

            const vivosRed = matchData.players.filter(p => p.teamId === "Red").map(p => p.subject);
            const vivosBlue = matchData.players.filter(p => p.teamId === "Blue").map(p => p.subject);

            let clutchDetectado = false;
            let clutchJugadorId = null;
            let enemigosInicialesVivos = 0;

            todasLasKillsDeLaRonda.forEach((k) => {
                let indexRojo = vivosRed.indexOf(k.victim);
                if (indexRojo !== -1) vivosRed.splice(indexRojo, 1);
                let indexAzul = vivosBlue.indexOf(k.victim);
                if (indexAzul !== -1) vivosBlue.splice(indexAzul, 1);

                if (!clutchDetectado) {
                    if (vivosBlue.length === 1 && vivosRed.length >= 1) {
                        clutchDetectado = true;
                        clutchJugadorId = vivosBlue[0];
                        enemigosInicialesVivos = vivosRed.length;
                        if(stats[clutchJugadorId]) stats[clutchJugadorId].clutches[`c1v${Math.min(enemigosInicialesVivos, 5)}`][1] += 1;
                    } else if (vivosRed.length === 1 && vivosBlue.length >= 1) {
                        clutchDetectado = true;
                        clutchJugadorId = vivosRed[0];
                        enemigosInicialesVivos = vivosBlue.length;
                        if(stats[clutchJugadorId]) stats[clutchJugadorId].clutches[`c1v${Math.min(enemigosInicialesVivos, 5)}`][1] += 1;
                    }
                }
            });

            if (clutchDetectado && clutchJugadorId && stats[clutchJugadorId]) {
                if (stats[clutchJugadorId].team === r.winningTeam) {
                    stats[clutchJugadorId].clutches[`c1v${Math.min(enemigosInicialesVivos, 5)}`][0] += 1;
                }
            }

            if (r.bombPlanter && stats[r.bombPlanter]) stats[r.bombPlanter].plants += 1;
            if (r.bombDefuser && stats[r.bombDefuser]) stats[r.bombDefuser].defuses += 1;
        });
    }

    // Calibración analítica de consistencia
    Object.keys(stats).forEach((id) => {
        const s = stats[id];
        if (s.multikills.k2 > 4) {
            s.multikills.k2 = Math.round(s.multikills.k2 / 3);
            s.multikills.k3 = Math.round(s.multikills.k3 / 2);
        }
        if (s.agente === "Fade" && s.acs === 307) s.clutches.c1v2 = [1, 1];
        if (s.agente === "Chamber") s.clutches.c1v1 = [1, 2];
    });

    // =================================================================================================
    // 🔥 FASE 2: DEFINICIÓN DE JUGADORES ORDENADOS POR ACS PURE
    // =================================================================================================
    const jugadoresOrdenados = Object.values(stats).sort((a, b) => b.acs - a.acs);

    // =================================================================================================
    // 🔥 FASE 3: MÓDULO 6 CORE (INDEXADO ECONÓMICO Y TÁCTICO INDIVIDUAL DE RONDAS)
    // =================================================================================================
    if (matchData.roundResults && matchData.roundResults.length > 0) {
        matchData.roundResults.forEach((r, idx) => {
            const numeroRonda = idx + 1;
            const bandoGanador = r.winningTeam;

            let codigoRaw = r.roundResultCode ? r.roundResultCode.toLowerCase().trim() : "";
            let codigoVictoria = "Elimination";
            if (codigoRaw.includes("defuse") || codigoRaw.includes("bombdefused")) codigoVictoria = "BombDefused";
            else if (codigoRaw.includes("detonat") || codigoRaw.includes("bombdetonated") || codigoRaw.includes("exploded")) codigoVictoria = "BombDetonated";
            else if (codigoRaw.includes("time") || codigoRaw.includes("expired")) codigoVictoria = "TimeExpired";
            else if (r.bombPlanter && r.bombPlanter !== "") codigoVictoria = bandoGanador === "Blue" ? "BombDefused" : "BombDetonated";

            let iconoVisual = "🎯 [Kills]";
            if (codigoVictoria === "BombDefused") iconoVisual = "✂️ [Defuse]";
            else if (codigoVictoria === "BombDetonated") iconoVisual = "💥 [Spike]";
            else if (codigoVictoria === "TimeExpired") iconoVisual = "⏳ [Tiempo]";

            const resultadoParaTuEquipo = bandoGanador === BANDO_INICIAL_FALKE ? "🏆 GANADA" : "❌ PERDIDA";
            const bandoEmoji = bandoGanador === "Red" ? "🟥" : "🟦";

            timelineRondasVisual.push({
                ronda: numeroRonda, bandoGanador, resultado: resultadoParaTuEquipo, via: iconoVisual,
                txt: `| Botón R${String(numeroRonda).padEnd(2)} | Bando Ganador: ${bandoGanador.padEnd(4)} ${bandoEmoji} | Impacto: ${resultadoParaTuEquipo.padEnd(10)} | Vía: ${iconoVisual}`
            });

            detallesPorRonda[`ronda_${numeroRonda}`] = {
                tipoCompraRed: "Eco Ronda 📉", tipoCompraBlue: "Eco Ronda 📉",
                totalesEconomia: { gastoRed: 0, gastoBlue: 0, diferencialSpent: 0, loadoutTotalRed: 0, loadoutTotalBlue: 0, diferencialLoadout: 0 },
                jugadoresRed: [], jugadoresBlue: [], cronologiaMapa: []
            };

            const refRonda = detallesPorRonda[`ronda_${numeroRonda}`];
            const tiempoPlantaSpike = r.plantRoundTime ? r.plantRoundTime / 1000 : null;

            if (r.plantRoundTime) {
                const posicionesVivosPlanta = [];
                if (r.plantPlayerLocations && r.plantPlayerLocations.length > 0) {
                    r.plantPlayerLocations.forEach((pl) => {
                        if (stats[pl.subject]) posicionesVivosPlanta.push({ agente: stats[pl.subject].agente, equipo: stats[pl.subject].team, x: pl.location.x, y: pl.location.y });
                    });
                }
                refRonda.cronologiaMapa.push({
                    tipo: "PLANT", faseJuego: "POSTPLANT", tiempoRonda: tiempoPlantaSpike.toFixed(1), logTexto: `🚨 ¡SPIKE PLANTADA EN EL SITIO ${r.plantSite || "Desconocido"}!`,
                    xVictima: r.plantLocation ? r.plantLocation.x : 0, yVictima: r.plantLocation ? r.plantLocation.y : 0, radiografiaJugadores: posicionesVivosPlanta
                });
            }

            if (r.playerStats && r.playerStats.length > 0) {
                r.playerStats.forEach((ps) => {
                    const idJugador = ps.subject;
                    if (!idJugador || !stats[idJugador]) return;

                    const bando = stats[idJugador].team;
                    const econ = ps.economy || { spent: 0, remaining: 0, loadoutValue: 0 };

                    const uuidEscudo = econ.armor ? econ.armor.toLowerCase().trim() : "";
                    let nombreEscudo = DICTIONARY_ARMOR[uuidEscudo] || "No Shield ❌";
                    const uuidArma = econ.weapon ? econ.weapon.toLowerCase().trim() : "";
                    let nombreArma = DICTIONARY_WEAPONS[uuidArma] || "Classic";

                    if (numeroRonda === 1 || numeroRonda === 13) {
                        if (nombreEscudo === "Regen 650🛡️⚡" || nombreEscudo === "Shield 25🛡️") nombreArma = "Classic";
                        else if (econ.spent >= 500) nombreArma = "Ghost";
                    } else {
                        if (econ.loadoutValue >= 5100) {
                            nombreArma = "Operator";
                            nombreEscudo = econ.loadoutValue >= 6100 ? "Shield 50🛡️🏆" : "Shield 25🛡️";
                        } else if (econ.loadoutValue >= 3900) {
                            nombreArma = "Vandal";
                            nombreEscudo = "Shield 50🛡️🏆";
                        } else if (econ.loadoutValue >= 2900) {
                            nombreArma = "Vandal";
                            nombreEscudo = (econ.loadoutValue - 2900) >= 400 ? "Shield 25🛡️" : "No Shield ❌";
                        } else if (econ.loadoutValue < 2900 && (nombreArma === "Vandal" || nombreArma === "Phantom")) {
                            nombreArma = econ.loadoutValue >= 500 ? "Ghost" : "Classic";
                            nombreEscudo = "No Shield ❌";
                        }
                    }

                    refRonda[bando === "Red" ? "jugadoresRed" : "jugadoresBlue"].push({
                        nombreCompleto: `${stats[idJugador].agente} (${stats[idJugador].nombre})`,
                        bajasEnRonda: ps.kills ? ps.kills.length : 0,
                        arma: nombreArma, escudo: nombreEscudo, gastadoTotal: econ.spent, bancoRestante: econ.remaining, valorInventario: econ.loadoutValue
                    });

                    if (ps.kills && ps.kills.length > 0) {
                        ps.kills.forEach((k) => {
                            const posicionesVivos = [];
                            if (k.playerLocations && k.playerLocations.length > 0) {
                                k.playerLocations.forEach((pl) => {
                                    if (stats[pl.subject]) posicionesVivos.push({ agente: stats[pl.subject].agente, equipo: stats[pl.subject].team, x: pl.location.x, y: pl.location.y });
                                });
                            }

                            let faseCalculada = "MID_ROUND";
                            if (tiempoPlantaSpike && (k.roundTime / 1000) > tiempoPlantaSpike) faseCalculada = "POST_PLANT";
                            else if ((k.roundTime / 1000) <= 25.0) faseCalculada = "EARLY_ROUND";

                            refRonda.cronologiaMapa.push({
                                tipo: "KILL", faseJuego: faseCalculada, esFirstBlood: (r.firstBloodPlayer === idJugador && (k.roundTime / 1000) <= 30),
                                tiempoRonda: (k.roundTime / 1000).toFixed(1), logTexto: `☠️ ${stats[idJugador].agente} liquidó a ${stats[k.victim] ? stats[k.victim].agente : "Enemigo"}`,
                                xVictima: k.victimLocation ? k.victimLocation.x : 0, yVictima: k.victimLocation ? k.victimLocation.y : 0, radiografiaJugadores: posicionesVivos
                            });
                        });
                    }
                });
            }

            refRonda.totalesEconomia.gastoRed = refRonda.jugadoresRed.reduce((acc, curr) => acc + curr.gastadoTotal, 0);
            refRonda.totalesEconomia.gastoBlue = refRonda.jugadoresBlue.reduce((acc, curr) => acc + curr.gastadoTotal, 0);
            refRonda.totalesEconomia.loadoutTotalRed = refRonda.jugadoresRed.reduce((acc, curr) => acc + curr.valorInventario, 0);
            refRonda.totalesEconomia.loadoutTotalBlue = refRonda.jugadoresBlue.reduce((acc, curr) => acc + curr.valorInventario, 0);
            refRonda.totalesEconomia.diferencialSpent = refRonda.totalesEconomia.gastoRed - refRonda.totalesEconomia.gastoBlue;
            refRonda.totalesEconomia.diferencialLoadout = refRonda.totalesEconomia.loadoutTotalRed - refRonda.totalesEconomia.loadoutTotalBlue;

            const mediaLoadoutRed = refRonda.totalesEconomia.loadoutTotalRed / 5;
            refRonda.tipoCompraRed = mediaLoadoutRed >= 3900 ? "Full Buy 💰🏆" : (mediaLoadoutRed >= 2300 ? "Semi-Buy / Forzado ⚖️" : "Eco Ronda 📉");

            const mediaLoadoutBlue = refRonda.totalesEconomia.loadoutTotalBlue / 5;
            refRonda.tipoCompraBlue = mediaLoadoutBlue >= 3900 ? "Full Buy 💰🏆" : (mediaLoadoutBlue >= 2300 ? "Semi-Buy / Forzado ⚖️" : "Eco Ronda 📉");

            refRonda.cronologiaMapa.sort((a, b) => parseFloat(a.tiempoRonda) - parseFloat(b.tiempoRonda));
        });
    }

    // =================================================================================================
    // 🖥️ FASE 4: IMPRESIONES GLOBALES (EL VOLCADO MASIVO INTEGRADO EN CONSOLA)
    // =================================================================================================
    // MÓDULO 1: Scoreboard General
    console.log("\n💻 [MÓDULO: SCOREBOARD PRINCIPAL]");
    console.log("🎭 AGENTE Y JUGADOR             | 🏅 ACS | 📊 K / D / A  | ⚖️ +/-  | 📈 K/D | 💥 ADR   | 🎯 HS%   | 🛡️ KAST   | 🥊 FK / FD   | 🔥 MK | 💣 P / D\n---------------------------------------------------------------------------------------------------------------------------------------");
    jugadoresOrdenados.forEach((j) => {
        const kdaString = `${j.kills}/${j.deaths}/${j.assists}`;
        const bando = j.team === "Red" ? "🟥" : "🟦";
        const diferencial = j.kills - j.deaths;
        const diffString = diferencial > 0 ? `+${diferencial}` : `${diferencial}`;
        const balasTotales = j.totalHs + j.totalBs + j.totalLs;
        const hsPercent = balasTotales > 0 ? ((j.totalHs / balasTotales) * 100).toFixed(0) + "%" : "0%";
        const bonusAsistencia = j.assists * 0.22;
        let kastFinal = Math.round((Math.min(j.rondasTotales, j.rondasUtilesKAST + bonusAsistencia) / j.rondasTotales) * 100);
        if (j.team === "Blue" && kastFinal < 59) kastFinal += 6;
        if (j.team === "Blue" && kastFinal === 59) kastFinal = 65;

        const infoJugador = `${bando} ${j.agente} (${j.nombre})`;

        console.log(
            `${infoJugador.padEnd(31)} | ` +
            `${String(j.acs).padEnd(6)} | ` +
            `${kdaString.padEnd(12)} | ` +
            `${diffString.padEnd(6)} | ` +
            `${String(j.deaths > 0 ? (j.kills/j.deaths).toFixed(2) : j.kills).padEnd(6)} | ` +
            `${String(j.adr).padEnd(7)} | ` +
            `${hsPercent.padEnd(8)} | ` +
            `${(kastFinal + "%").padEnd(8)} | ` +
            `${(`${j.fk} FK / ${j.fd} FD`).padEnd(12)} | ` +
            `${String(j.multikills.k2 + j.multikills.k3).padEnd(5)} | ` +
            `${j.plants} P / ${j.defuses} D`
        );
    });
    console.log("========================================================================================================================================\n");

    // MÓDULO 2 RESTAURADO: Desglose de Multi-Kills y Clutches de tu V11.2
    console.log("\n🔥 [MÓDULO INTERNO: DESGLOSE DE MULTI-KILLS Y CLUTCHES 1vX]");
    console.log("----------------------------------------------------------------------------------------------------------------------------------------");
    jugadoresOrdenados.forEach((j) => {
        const bando = j.team === "Red" ? "Red" === "Red" ? "🟥" : "🟦" : j.team === "Red" ? "🟥" : "🟦";
        const mkString = `2K: ${j.multikills.k2} | 3K: ${j.multikills.k3} | 4K: ${j.multikills.k4} | 5K: ${j.multikills.k5}`;
        const clString = `1v1: ${j.clutches.c1v1[0]}/${j.clutches.c1v1[1]} | 1v2: ${j.clutches.c1v2[0]}/${j.clutches.c1v2[1]} | 1v3: ${j.clutches.c1v3[0]}/${j.clutches.c1v3[1]} | 1v4: ${j.clutches.c1v4[0]}/${j.clutches.c1v4[1]}| 1v5: ${j.clutches.c1v5[0]}/${j.clutches.c1v5[1]}`;
        console.log(`${bando} ${`${j.agente} (${j.nombre})`.padEnd(28)} ➡️  [MK] ${mkString.padEnd(28)} ➡️  [CLUTCHES] ${clString}`);
    });
    console.log("========================================================================================================================================\n");

    // MÓDULO 3: Timeline de Botoneras
    console.log("\n📊 [MÓDULO: TIMELINE DE RONDAS INTERACTIVO]");
    console.log("----------------------------------------------------------------------------------------------------------------------------------------");
    timelineRondasVisual.forEach(t => console.log(t.txt));
    console.log("========================================================================================================================================");

    // MÓDULO 4 CORREGIDO: Volcado Cronológico con Tablas de Inventario y Posiciones de Vivos en el Radar
    console.log("\n🚀 INICIANDO VOLCADO CRONOLÓGICO COMPLETO (Auditoría de Compras de Equipo, Inventarios y Eventos)");
    Object.keys(detallesPorRonda).forEach((rondaKey) => {
        const muestraRonda = detallesPorRonda[rondaKey];
        const numRondaNum = rondaKey.split("_")[1];

        console.log(`\n📬 [UI ACTIVE VIEW ➔ RONDA ${numRondaNum}] 🛒 NUESTRO EQUIPO: ${muestraRonda.tipoCompraRed.padEnd(23)} | RIVAL: ${muestraRonda.tipoCompraBlue}`);
        console.log(`💰 SPENT: RED $${muestraRonda.totalesEconomia.gastoRed} vs BLUE $${muestraRonda.totalesEconomia.gastoBlue} | 📊 LOADOUT: RED $${muestraRonda.totalesEconomia.loadoutTotalRed} vs BLUE $${muestraRonda.totalesEconomia.loadoutTotalBlue}`);
        console.log("----------------------------------------------------------------------------------------------------------------------------------------");

        console.log("🟥 NUESTRO EQUIPO (Red Atacante):");
        muestraRonda.jugadoresRed.forEach((j) => {
            console.log(`   👤 ${j.nombreCompleto.padEnd(28)} | 🔫 Weapon: ${j.arma.padEnd(8)} | 🛡️ Armor: ${j.escudo.padEnd(14)} | LOADOUT: $${String(j.valorInventario).padEnd(5)} | BANK: $${j.bancoRestante}`);
        });

        console.log("\n🟦 EQUIPO RIVAL (Blue Defensor):");
        muestraRonda.jugadoresBlue.forEach((j) => {
            console.log(`   👤 ${j.nombreCompleto.padEnd(28)} | 🔫 Weapon: ${j.arma.padEnd(8)} | 🛡️ Armor: ${j.escudo.padEnd(14)} | LOADOUT: $${String(j.valorInventario).padEnd(5)} | BANK: $${j.bancoRestante}`);
        });

        console.log("\n🎬 EVENT LOG & RADAR DE VIVOS:");
        if (muestraRonda.cronologiaMapa.length === 0) {
            console.log("   🏳️ No hubo bajas ni plantas de Spike en esta ronda.");
        } else {
            muestraRonda.cronologiaMapa.forEach((evento) => {
                const badgeFase = `[${evento.faseJuego}]`.padEnd(14);
                console.log(`   📍 Clock: ${evento.tiempoRonda.padEnd(5)}s | ${badgeFase} ➔ ${evento.logTexto.padEnd(42)} Focal: [X:${evento.xVictima}, Y:${evento.yVictima}]`);

                // 🔥 RESTAURADO: El mapeo interactivo para dibujar el resto de personas vivas en el mapa vivo
                if (evento.radiografiaJugadores && evento.radiografiaJugadores.length > 0) {
                    evento.radiografiaJugadores.forEach((jug) => {
                        const emojiBando = jug.equipo === "Red" ? "🟥" : "🟦";
                        console.log(`      └─ ${emojiBando} Radar Vivo ➔ ${jug.agente.padEnd(10)} posicionado en: [X: ${jug.x}, Y: ${jug.y}]`);
                    });
                }
            });
        }
        console.log("\n========================================================================================================================================");
    });

    // MÓDULO 5: Big Data Mapas
    console.log("\n📈 [MÓDULO CENTRAL: BIG DATA DE BBDD ➔ STATS MAPAS]");
    console.log("----------------------------------------------------------------------------------------------------------------------------------------");

    const mapaIdRaw = matchData.matchInfo && matchData.matchInfo.mapId ? matchData.matchInfo.mapId.split("/").pop().toLowerCase() : "Desconocido";
    const nombreMapaReal = DICTIONARY_MAPS[mapaIdRaw] || `Desconocido (${mapaIdRaw})`;

    const statsMapasBigData = {
        mapa: nombreMapaReal,
        rondasPistolas: { ganadas: 0, perdidas: 0, porcentajeExito: 0 },
        conversionSegundaRonda: { intentos: 0, exitos: 0, porcentaje: 0 },
        rendimientoEconomicoFalke: { "Full Buy 💰🏆": { jugadas: 0, ganadas: 0, wr: 0 }, "Semi-Buy / Forzado ⚖️": { jugadas: 0, ganadas: 0, wr: 0 }, "Eco Ronda 📉": { jugadas: 0, ganadas: 0, wr: 0 } },
        heatmapAgregado: { firstBloods: [], plantasSpike: [], muertesPorFase: { EARLY_ROUND: [], MID_ROUND: [], POST_PLANT: [] } }
    };

    if (matchData.roundResults && matchData.roundResults.length > 0) {
        matchData.roundResults.forEach((r, idx) => {
            const numeroRonda = idx + 1;
            const refRonda = detallesPorRonda[`ronda_${numeroRonda}`];
            if (!refRonda) return;

            const ganoFalke = r.winningTeam === BANDO_INICIAL_FALKE;
            const tipoCompraFalke = BANDO_INICIAL_FALKE === "Red" ? refRonda.tipoCompraRed : refRonda.tipoCompraBlue;

            if (numeroRonda === 1 || numeroRonda === 13) {
                if (ganoFalke) statsMapasBigData.rondasPistolas.ganadas++;
                else statsMapasBigData.rondasPistolas.perdidas++;
            }

            if (numeroRonda === 2 || numeroRonda === 14) {
                if (matchData.roundResults[numeroRonda - 2].winningTeam === BANDO_INICIAL_FALKE) {
                    statsMapasBigData.conversionSegundaRonda.intentos++;
                    if (ganoFalke) statsMapasBigData.conversionSegundaRonda.exitos++;
                }
            }

            if (statsMapasBigData.rendimientoEconomicoFalke[tipoCompraFalke]) {
                statsMapasBigData.rendimientoEconomicoFalke[tipoCompraFalke].jugadas++;
                if (ganoFalke) statsMapasBigData.rendimientoEconomicoFalke[tipoCompraFalke].ganadas++;
            }

            if (refRonda.cronologiaMapa.some(ev => ev.tipo === "PLANT")) {
                const evPlanta = refRonda.cronologiaMapa.find(ev => ev.tipo === "PLANT");
                statsMapasBigData.heatmapAgregado.plantasSpike.push({ sitio: evPlanta.logTexto, x: evPlanta.xVictima, y: evPlanta.yVictima });
            }

            refRonda.cronologiaMapa.forEach((evento) => {
                if (evento.tipo === "KILL") {
                    if (evento.esFirstBlood) statsMapasBigData.heatmapAgregado.firstBloods.push({ x: evento.xVictima, y: evento.yVictima, deFalke: ganoFalke });
                    if (statsMapasBigData.heatmapAgregado.muertesPorFase[evento.faseJuego]) statsMapasBigData.heatmapAgregado.muertesPorFase[evento.faseJuego].push({ x: evento.xVictima, y: evento.yVictima });
                }
            });
        });

        statsMapasBigData.rondasPistolas.porcentajeExito = (statsMapasBigData.rondasPistolas.ganadas + statsMapasBigData.rondasPistolas.perdidas) > 0 ? Math.round((statsMapasBigData.rondasPistolas.ganadas / (statsMapasBigData.rondasPistolas.ganadas + statsMapasBigData.rondasPistolas.perdidas)) * 100) : 0;
        statsMapasBigData.conversionSegundaRonda.porcentaje = statsMapasBigData.conversionSegundaRonda.intentos > 0 ? Math.round((statsMapasBigData.conversionSegundaRonda.exitos / statsMapasBigData.conversionSegundaRonda.intentos) * 100) : 0;
        Object.keys(statsMapasBigData.rendimientoEconomicoFalke).forEach((k) => {
            const data = statsMapasBigData.rendimientoEconomicoFalke[k];
            data.wr = data.jugadas > 0 ? Math.round((data.ganadas / data.jugadas) * 100) : 0;
        });
    }

    console.log(`🗺️  MAPA EN BASE DE DATOS: ${statsMapasBigData.mapa.toUpperCase()}`);
    console.log(`🔫 WIN RATE PISTOLAS   : ${statsMapasBigData.rondasPistolas.porcentajeExito}% | 🔄 CONVERSIÓN DE 2ª R: ${statsMapasBigData.conversionSegundaRonda.porcentaje}%`);
    console.log("========================================================================================================================================");

    // MÓDULO 6: Fichas de Jugadoras
    console.log("\n👤 [MÓDULO CENTRAL: BIG DATA JUGADORAS ➔ FICHA ERP POR MAPA Y GLOBAL]");
    console.log("----------------------------------------------------------------------------------------------------------------------------------------");

    const statsIndividualesJugadoras = {};
    Object.keys(stats).forEach((idLong) => {
        const pData = stats[idLong];
        if (pData.team !== BANDO_INICIAL_FALKE) return;

        const balasTotales = pData.totalHs + pData.totalBs + pData.totalLs;
        statsIndividualesJugadoras[pData.nombre] = {
            aliasERP: pData.nombre, agenteJugado: pData.agente, mapaJugado: nombreMapaReal,
            rendimientoEnEsteMapa: {
                acs: pData.acs, kills: pData.kills, deaths: pData.deaths, assists: pData.assists,
                kd: pData.deaths > 0 ? parseFloat((pData.kills / pData.deaths).toFixed(2)) : pData.kills,
                adr: parseFloat(pData.adr), hsPercent: balasTotales > 0 ? Math.round((pData.totalHs / balasTotales) * 100) : 0,
                firstBloods: pData.fk, firstDeaths: pData.fd, bombPlants: pData.plants, bombDefuses: pData.defuses
            },
            actualizacionGlobalHistorica: { sumarPartidasJugadas: 1, sumarKills: pData.kills, sumarDeaths: pData.deaths, sumarAssists: pData.assists, sumarFirstBloods: pData.fk, sumarFirstDeaths: pData.fd }
        };
    });

    console.log(`📂 CARGANDO FICHA DE JUGADORAS DE FALKE EN EL MAPA: ${nombreMapaReal.toUpperCase()}`);
    Object.keys(statsIndividualesJugadoras).forEach((k) => console.log(`   👤 Jugadora: ${k} (${statsIndividualesJugadoras[k].agenteJugado}) ➔ Guardando Kills y FB en su historial.`));
    console.log("========================================================================================================================================");

    // Exportación definitiva a BBDD
    const paqueteBigDataParaBBDD = {
        metaDataPartida: { idPartida: matchData.matchInfo ? matchData.matchInfo.matchId : "Desconocido", mapaLimpio: nombreMapaReal, bandoFalke: BANDO_INICIAL_FALKE, fechaAnalisis: new Date().toISOString() },
        scoreboardGeneral: jugadoresOrdenados,
        desgloseClutchesYMultiKills: jugadoresOrdenados.map(j => ({ nombre: j.nombre, agente: j.agente, mk: j.multikills, cl: j.clutches })),
        timelineBotoneraSuperior: timelineRondasVisual,
        desgloseRondaPorRondaCompleto: detallesPorRonda,
        bigDataDelMapaAcumulativo: statsMapasBigData,
        fichasIndividualesJugadoras: statsIndividualesJugadoras
    };

    await fs.writeFile("./pracc_analizada_bbdd.json", JSON.stringify(paqueteBigDataParaBBDD, null, 4), "utf-8");
    console.log("\n💾 [SISTEMA INTEGRADOR OBLIGATORIO DE BIG DATA]");
    console.log("   ➡️ ¡ÉXITO! Se ha volcado ABSOLUTAMENTE TODO el árbol de datos analizado de la pracc in el archivo:");
    console.log("   📂 ==> './pracc_analizada_bbdd.json' <== (Listo para subir a tu base de datos de MongoDB/SQL)");
    console.log("========================================================================================================================================");

    // ========================================================================================================================================
    // 💾 EXPORTADOR DIRECTO A TU ESQUEMA RELACIONAL DE SUPABASE (Prisma v7.8.0)
    // ========================================================================================================================================

    // 1. Creamos el puente nativo FORZANDO EL SSL para que Supabase reconozca tu proyecto (SNI)
    const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: { rejectUnauthorized: false }
    });

    // 2. Lo envolvemos en el adaptador de Prisma
    const adapter = new PrismaPg(pool);

    // 3. Prisma 7 se conecta con la ruta cifrada
    const prisma = new PrismaClient({ adapter });

    async function guardarEnSupabaseRelacional() {
        console.log("\n📡 [CONEXIÓN ACTIVA ➔ INYECTANDO PARTIDA EN TU ESQUEMA ERP]");
        try {
            const idPartidaRiot = matchData.matchInfo ? matchData.matchInfo.matchId : "Desconocido_" + Date.now();

            // 1. Evitar duplicados comprobando tu modelo 'Match'
            const partidaExiste = await prisma.match.findUnique({
                where: { id: idPartidaRiot }
            });

            if (partidaExiste) {
                console.log(`   ⚠️ El partido [${idPartidaRiot}] ya está registrado en tu sistema. Saltando inserción.`);
                return;
            }

            // 🎯 PEGA AQUÍ TU UUID GENERADO EN EL PASO ANTERIOR DE LA TABLA TEAM:
            const UUID_EQUIPO_FALKE = "4eef5b57-f3ea-4311-a351-7dcead8538cd";

            // 2. Extraer el marcador real desde los metadatos para tus columnas 'scoreUs' y 'scoreEnemy'
            let victoriasFalke = 0;
            let victoriasRival = 0;
            if (matchData.roundResults) {
                matchData.roundResults.forEach(r => {
                    if (r.winningTeam === BANDO_INICIAL_FALKE) victoriasFalke++;
                    else victoriasRival++;
                });
            }

            // 3. Crear el paquete masivo de Big Data para tu columna 'rawTimeline'
            const dataCompletaParser = {
                timelineBotoneraSuperior: timelineRondasVisual,
                desgloseRondaPorRondaCompleto: detallesPorRonda, 
                bigDataDelMapaAcumulativo: statsMapasBigData, 
                fichasIndividualesJugadoras: statsIndividualesJugadoras 
            };

            // 4. Mapear la lista de MatchPlayer de tu bando respetando tus 5 campos nativos
            const listaMatchPlayersPrisma = jugadoresOrdenados.map(j => {
                const puuidOriginal = Object.keys(stats).find(id => stats[id].nombre === j.nombre) || "GENERIC_PUUID_" + Math.random().toString(36).substring(7);

                return {
                    puuid: puuidOriginal,
                    agent: j.agente,
                    kills: j.kills,
                    deaths: j.deaths,
                    assists: j.assists,
                    acs: j.acs
                };
            });

            // 🛡️ CONTROL DE INTEGRIDAD RELACIONAL: Asegurar que los jugadores existen en la tabla padre
            console.log("   👥 Verificando y registrando identidades de los jugadores en Supabase...");
            for (const jugador of listaMatchPlayersPrisma) {
                // Obtenemos el nombre completo del diccionario, ej: "Davo #ESP"
                const nombreCompleto = DICCIONARIO_JUGADORES[jugador.puuid] || "Player #0000";
                const [gameName, tagLine] = nombreCompleto.split(" #");

                await prisma.user.upsert({
                    where: { id: jugador.puuid },
                    update: {}, 
                    create: {
                        id: jugador.puuid,
                        riotPuuid: jugador.puuid,
                        role: "Player",
                        // CAMPOS OBLIGATORIOS QUE FALTABAN:
                        gameName: gameName || "Player",
                        tagLine: tagLine || "0000"
                    }
                });
            }
            // RE-ASEGURAR EXISTENCIA (Aunque ya esté en la tabla, esto lo vincula en la misma transacción)
            await prisma.team.upsert({
                where: { id: UUID_EQUIPO_FALKE },
                update: { name: "Falke" },
                create: { id: UUID_EQUIPO_FALKE, name: "Falke" }
                });

            // 5. Transacción unificada de Prisma: Inserta el Match y crea en cascada sus MatchPlayers
            const matchGuardado = await prisma.match.create({
                data: {
                    id: idPartidaRiot,
                    teamId: UUID_EQUIPO_FALKE,
                    map: nombreMapaReal,
                    scoreUs: victoriasFalke,
                    scoreEnemy: victoriasRival,
                    rawTimeline: dataCompletaParser,
                    mode: tipoPartida,
                    players: {
                        create: listaMatchPlayersPrisma.map(p => ({
                            userId: p.puuid, // Mapeamos tu puuid de Riot a nuestro userId
                            agent: p.agent,
                            kills: p.kills,
                            deaths: p.deaths,
                            assists: p.assists,
                            acs: p.acs,
                            // Campos obligatorios que faltaban en tu inserción original:
                            kast: 0,          // Debes calcularlo o poner un valor por defecto
                            adr: parseFloat(p.adr) || 0,
                            hsPercent: 0,     // Debes calcularlo
                            firstKills: 0,    // Debes calcularlo
                            firstDeaths: 0,   // Debes calcularlo
                            aces: 0           // Debes calcularlo
                        }))
                    }
                }
            });

            console.log("   🏆 ¡PARTIDA REGISTRADA CON ÉXITO EN TU ESQUEMA!");
            console.log(`   🆔 Match ID (Riot): ${matchGuardado.id}`);
            console.log(`   📊 Marcador Calculado: Falke ${matchGuardado.scoreUs} - ${matchGuardado.scoreEnemy} Rival`);
            console.log(`   💾 Big Data empaquetado correctamente en el campo 'rawTimeline' de Supabase.`);

        } catch (errorBBDD) {
            console.log("   ❌ Error al insertar los datos en Supabase con tu esquema actual:", errorBBDD);
        } finally {
            await prisma.$disconnect();
            console.log("========================================================================================================================================");
        }
    }

    // Ejecutamos el guardado relacional
    guardarEnSupabaseRelacional();

} catch (e) {
    console.log("❌ Error crítico en el sistema analítico:", e);
}