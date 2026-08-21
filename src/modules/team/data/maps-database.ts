export const mapBackgrounds: Record<string, string> = {
    Pearl: "/maps/pearl.png",
    Ascent: "/maps/ascent.png",
    Bind: "/maps/bind.png",
    Abyss: "/maps/abyss.png",
    Haven: "/maps/haven.png",
    Lotus: "/maps/lotus.png",
    Breeze: "/maps/breeze.png",
    Icebox: "/maps/icebox.png",
    Split: "/maps/split.png",
    Fracture: "/maps/fracture.png",
    Sunset: "/maps/sunset.png"
  }
  
  export const ACTIVE_MAP_POOL = ["Ascent", "Fracture", "Breeze", "Haven", "Lotus", "Split", "Pearl"]
  
  export const sheetsDatabase: Record<string, any> = {
    GLOBAL: {
      played: 19, won: 13, lost: 6, winRate: "68%",
      flkRounds: 232, enemyRounds: 201, roundDiff: "+31",
      atkWinRate: "53.07%", defWinRate: "48.68%",
      pistolAtk: "47.37%", pistolDef: "42.11%",
      bestPistolAtk: "Pearl (66.6%)", bestPistolDef: "Ascent (100%)",
      economy: {
        pistol: { won: 17, lost: 21, total: 38, pct: 44 },
        eco: { won: 24, lost: 16, total: 40, pct: 60 },
        bonus: { won: 11, lost: 13, total: 24, pct: 45 },
        semiBuy: { won: 42, lost: 31, total: 73, pct: 57 },
        fullBuy: { won: 138, lost: 120, total: 258, pct: 53 }
      },
      winConditions: [
        { name: "Eliminación Completa", pct: 58, count: "135 rondas", color: "bg-emerald-500" },
        { name: "Detonación de Spike (ATK)", pct: 24, count: "56 rondas", color: "bg-amber-500" },
        { name: "Desactivación de Spike (DEF)", pct: 18, count: "41 rondas", color: "bg-cyan-500" }
      ],
      macroTrends: { postPlantSuccess: "56.4%", retakeSuccess: "42.1%", fkConversion: "74.3%" }
    },
    Split: {
      played: 2, won: 2, lost: 0, winRate: "100%", flkRounds: 28, enemyRounds: 10, roundDiff: "+18",
      atkWinRate: "76.19%", defWinRate: "70.59%", pistolAtk: "50.00%", pistolDef: "50.00%",
      economy: {
        pistol: { won: 2, lost: 2, total: 4, pct: 50 },
        eco: { won: 4, lost: 1, total: 5, pct: 80 },
        bonus: { won: 2, lost: 1, total: 3, pct: 66 },
        semiBuy: { won: 4, lost: 1, total: 5, pct: 80 },
        fullBuy: { won: 16, lost: 5, total: 21, pct: 76 }
      },
      openings: [
        { name: "Bando Atacante (ATK)", fk: 9, fd: 5, diff: "+4", color: "text-emerald-400", side: "ATK" },
        { name: "Bando Defensor (DEF)", fk: 7, fd: 7, diff: "0", color: "text-muted-foreground", side: "DEF" }
      ],
      sitesData: [
        { name: "SITE A", atkWin: 70, defWin: 75, atkFk: 65, defFk: 60, postPlant: 80 },
        { name: "SITE B", atkWin: 82, defWin: 66, atkFk: 71, defFk: 55, postPlant: 85 }
      ],
      winConditions: [
        { name: "Eliminación", pct: 64, count: "18 rondas", color: "bg-emerald-500" },
        { name: "Detonación Spike", pct: 22, count: "6 rondas", color: "bg-amber-500" },
        { name: "Desactivación Spike", pct: 14, count: "4 rondas", color: "bg-cyan-500" }
      ]
    },
    Haven: {
      played: 4, won: 1, lost: 3, winRate: "25%", flkRounds: 34, enemyRounds: 59, roundDiff: "-25",
      atkWinRate: "34.88%", defWinRate: "37.21%", pistolAtk: "50.00%", pistolDef: "50.00%",
      economy: {
        pistol: { won: 4, lost: 4, total: 8, pct: 50 }, eco: { won: 2, lost: 8, total: 10, pct: 20 },
        bonus: { won: 1, lost: 3, total: 4, pct: 25 }, semiBuy: { won: 7, lost: 9, total: 16, pct: 43 },
        fullBuy: { won: 20, lost: 35, total: 55, pct: 36 }
      },
      openings: [
        { name: "Bando Atacante (ATK)", fk: 6, fd: 16, diff: "-10", color: "text-primary", side: "ATK" },
        { name: "Bando Defensor (DEF)", fk: 9, fd: 15, diff: "-6", color: "text-primary", side: "DEF" }
      ],
      sitesData: [
        { name: "SITE A", atkWin: 30, defWin: 40, atkFk: 35, defFk: 38, postPlant: 42 },
        { name: "SITE B", atkWin: 25, defWin: 33, atkFk: 20, defFk: 45, postPlant: 30 },
        { name: "SITE C", atkWin: 44, defWin: 38, atkFk: 40, defFk: 42, postPlant: 50 }
      ],
      winConditions: [
        { name: "Eliminación", pct: 48, count: "16 rondas", color: "bg-emerald-500" },
        { name: "Detonación Spike", pct: 26, count: "9 rondas", color: "bg-amber-500" },
        { name: "Desactivación Spike", pct: 26, count: "9 rondas", color: "bg-cyan-500" }
      ]
    },
    Pearl: {
      played: 3, won: 2, lost: 1, winRate: "67%", flkRounds: 35, enemyRounds: 30, roundDiff: "+5",
      atkWinRate: "62.07%", defWinRate: "47.22%", pistolAtk: "66.67%", pistolDef: "33.33%",
      economy: {
        pistol: { won: 4, lost: 2, total: 6, pct: 66 }, eco: { won: 5, lost: 3, total: 8, pct: 62 },
        bonus: { won: 2, lost: 2, total: 4, pct: 50 }, semiBuy: { won: 6, lost: 5, total: 11, pct: 54 },
        fullBuy: { won: 18, lost: 18, total: 36, pct: 50 }
      },
      openings: [
        { name: "Bando Atacante (ATK)", fk: 11, fd: 4, diff: "+7", color: "text-emerald-400", side: "ATK" },
        { name: "Bando Defensor (DEF)", fk: 7, fd: 7, diff: "0", color: "text-muted-foreground", side: "DEF" }
      ],
      sitesData: [
        { name: "SITE A", atkWin: 55, defWin: 50, atkFk: 58, defFk: 48, postPlant: 60 },
        { name: "SITE B", atkWin: 68, defWin: 44, atkFk: 64, defFk: 42, postPlant: 72 }
      ],
      winConditions: [
        { name: "Eliminación", pct: 54, count: "19 rondas", color: "bg-emerald-500" },
        { name: "Detonación Spike", pct: 31, count: "11 rondas", color: "bg-amber-500" },
        { name: "Desactivación Spike", pct: 15, count: "5 rondas", color: "bg-cyan-500" }
      ]
    },
    Ascent: {
      played: 1, won: 1, lost: 0, winRate: "100%", flkRounds: 21, enemyRounds: 3, roundDiff: "+18",
      atkWinRate: "83.33%", defWinRate: "91.67%", pistolAtk: "0.00%", pistolDef: "100.00%",
      economy: {
        pistol: { won: 1, lost: 1, total: 2, pct: 50 }, eco: { won: 3, lost: 0, total: 3, pct: 100 },
        bonus: { won: 1, lost: 0, total: 1, pct: 100 }, semiBuy: { won: 4, lost: 1, total: 5, pct: 80 },
        fullBuy: { won: 12, lost: 1, total: 13, pct: 92 }
      },
      openings: [
        { name: "Bando Atacante (ATK)", fk: 5, fd: 1, diff: "+4", color: "text-emerald-400", side: "ATK" },
        { name: "Bando Defensor (DEF)", fk: 5, fd: 1, diff: "+4", color: "text-emerald-400", side: "DEF" }
      ],
      sitesData: [
        { name: "SITE A", atkWin: 80, defWin: 90, atkFk: 83, defFk: 88, postPlant: 88 },
        { name: "SITE B", atkWin: 86, defWin: 93, atkFk: 84, defFk: 95, postPlant: 90 }
      ],
      winConditions: [
        { name: "Eliminación", pct: 71, count: "15 rondas", color: "bg-emerald-500" },
        { name: "Detonación Spike", pct: 14, count: "3 rondas", color: "bg-amber-500" },
        { name: "Desactivación Spike", pct: 15, count: "3 rondas", color: "bg-cyan-500" }
      ]
    },
    Lotus: {
      played: 3, won: 3, lost: 0, winRate: "100%", flkRounds: 42, enemyRounds: 30, roundDiff: "+12",
      atkWinRate: "57.50%", defWinRate: "53.33%", pistolAtk: "50.00%", pistolDef: "50.00%",
      economy: {
        pistol: { won: 3, lost: 3, total: 6, pct: 50 }, eco: { won: 5, lost: 1, total: 6, pct: 83 },
        bonus: { won: 2, lost: 2, total: 4, pct: 50 }, semiBuy: { won: 7, lost: 3, total: 10, pct: 70 },
        fullBuy: { won: 25, lost: 21, total: 46, pct: 54 }
      },
      openings: [
        { name: "Bando Atacante (ATK)", fk: 13, fd: 6, diff: "+7", color: "text-emerald-400", side: "ATK" },
        { name: "Bando Defensor (DEF)", fk: 10, fd: 7, diff: "+3", color: "text-emerald-400", side: "DEF" }
      ],
      sitesData: [
        { name: "SITE A", atkWin: 52, defWin: 55, atkFk: 54, defFk: 50, postPlant: 58 },
        { name: "SITE B", atkWin: 60, defWin: 48, atkFk: 58, defFk: 44, postPlant: 66 },
        { name: "SITE C", atkWin: 64, defWin: 58, atkFk: 62, defFk: 65, postPlant: 70 }
      ],
      winConditions: [
        { name: "Eliminación", pct: 50, count: "21 rondas", color: "bg-emerald-500" },
        { name: "Detonación Spike", pct: 33, count: "14 rondas", color: "bg-amber-500" },
        { name: "Desactivación Spike", pct: 17, count: "7 rondas", color: "bg-cyan-500" }
      ]
    }
  }