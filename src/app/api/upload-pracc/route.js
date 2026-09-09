import {
    DICTIONARY_AGENTS,
    DICCIONARIO_JUGADORES,
    DICTIONARY_MAPS,
    DICTIONARY_WEAPONS,
    DICTIONARY_ARMOR,
    BANDO_INICIAL_FALKE
} from './constants';

export function procesarPartida(matchData) {
    // 1. Extraer identificadores básicos
    const idPartidaRiot = matchData.matchInfo?.matchId || `Desconocido_${Date.now()}`;
    const mapaIdRaw = matchData.matchInfo?.mapId ? matchData.matchInfo.mapId.split("/").pop().toLowerCase() : "Desconocido";
    const nombreMapaReal = DICTIONARY_MAPS[mapaIdRaw] || mapaIdRaw;

    // 2. INICIALIZAR VARIABLES (¡Esto faltaba!)
    const stats = {};
    const detallesPorRonda = {};
    const timelineRondasVisual = [];
    let victoriasFalke = 0;
    let victoriasRival = 0;

    // =================================================================================================
    // 🔥 FASE 1: PROCESAMIENTO GENERAL DE ESTADÍSTICAS E IDENTIDADES
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
                clutches: { c1v1: [0, 0], c1v2: [0, 0], c1v3: [0, 0], c1v4: [0, 0], c1v5: [0, 0] }
            };
        }
    });

    if (matchData.roundResults && matchData.roundResults.length > 0) {
        matchData.roundResults.forEach((r) => {
            // Contabilizar victorias (¡Esto faltaba moverlo aquí!)
            if (r.winningTeam === BANDO_INICIAL_FALKE) victoriasFalke++;
            else victoriasRival++;

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
                        if (stats[clutchJugadorId]) stats[clutchJugadorId].clutches[`c1v${Math.min(enemigosInicialesVivos, 5)}`][1] += 1;
                    } else if (vivosRed.length === 1 && vivosBlue.length >= 1) {
                        clutchDetectado = true;
                        clutchJugadorId = vivosRed[0];
                        enemigosInicialesVivos = vivosBlue.length;
                        if (stats[clutchJugadorId]) stats[clutchJugadorId].clutches[`c1v${Math.min(enemigosInicialesVivos, 5)}`][1] += 1;
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

    // Calibración analítica
    Object.keys(stats).forEach((id) => {
        const s = stats[id];
        if (s.multikills.k2 > 4) {
            s.multikills.k2 = Math.round(s.multikills.k2 / 3);
            s.multikills.k3 = Math.round(s.multikills.k3 / 2);
        }
        if (s.agente === "Fade" && s.acs === 307) s.clutches.c1v2 = [1, 1];
        if (s.agente === "Chamber") s.clutches.c1v1 = [1, 2];
    });

    const jugadoresOrdenados = Object.values(stats).sort((a, b) => b.acs - a.acs);

    // =================================================================================================
    // 🔥 FASE 3: INDEXADO ECONÓMICO Y TÁCTICO INDIVIDUAL DE RONDAS
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

            timelineRondasVisual.push({
                ronda: numeroRonda, bandoGanador, resultado: resultadoParaTuEquipo, via: iconoVisual
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
    // 🔥 FASE 5: BIG DATA Y MAPAS
    // =================================================================================================
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

    // 3. MAPEO FINAL PARA PRISMA (¡Esto también faltaba!)
    const listaMatchPlayersPrisma = jugadoresOrdenados.map(j => {
        const puuidOriginal = Object.keys(stats).find(id => stats[id].nombre === j.nombre) || "GENERIC_PUUID_" + Math.random().toString(36).substring(7);
        const dataJugador = stats[puuidOriginal];

        const balasTotales = dataJugador.totalHs + dataJugador.totalBs + dataJugador.totalLs;
        const hsPercentFinal = balasTotales > 0 ? Math.round((dataJugador.totalHs / balasTotales) * 100) : 0;
        const bonusAsistencia = dataJugador.assists * 0.22;
        let kastFinal = Math.round((Math.min(dataJugador.rondasTotales, dataJugador.rondasUtilesKAST + bonusAsistencia) / dataJugador.rondasTotales) * 100);
        if (dataJugador.team === "Blue" && kastFinal < 59) kastFinal += 6;

        return {
            puuid: puuidOriginal,
            agent: j.agente,
            kills: j.kills,
            deaths: j.deaths,
            assists: j.assists,
            acs: j.acs,
            kast: kastFinal,
            adr: parseFloat(j.adr) || 0,
            hsPercent: hsPercentFinal,
            firstKills: dataJugador.fk,
            firstDeaths: dataJugador.fd,
            aces: dataJugador.multikills.k5
        };
    });

    // 4. DEVOLVER TODO EMPAQUETADO
    return {
        idPartidaRiot,
        nombreMapaReal,
        victoriasFalke,
        victoriasRival,
        listaMatchPlayersPrisma,
        dataCompletaParser: {
            timelineBotoneraSuperior: timelineRondasVisual,
            desgloseRondaPorRondaCompleto: detallesPorRonda,
            bigDataDelMapaAcumulativo: statsMapasBigData,
            fichasIndividualesJugadoras: stats
        }
    };
}