export interface MapPerformance {
  mapName: string
  acs: number
  kd: number
  kda: string
  fkDiff: number
}

export interface VLRAgentStat {
  agentName: string
  usePercent: string
  rounds: number
  rating: number
  acs: number
  kd: number
  adr: number
  kast: string
  kpr: number
  apr: number
  fkpr: number
  fdpr: number
}

export interface PlayerStats {
  id: string
  name: string
  role: "Duelista" | "Iniciador" | "Controlador" | "Centinela" | "Flex"
  isIgl?: boolean
  games: number
  acs: number
  kd: number
  k: number
  d: number
  a: number
  fk: number
  plants: number
  defuses: number
  habitConsistency: number // % de cumplimiento de rutinas
  mapsData: MapPerformance[]
  vlrAgents: VLRAgentStat[]
}

export const playersDatabase: Record<string, PlayerStats> = {
  "xKittyx": {
    id: "1",
    name: "xKittyx",
    role: "Controlador",
    isIgl: true,
    games: 26, acs: 215, kd: 1.22, k: 18.6, d: 15.3, a: 7.9, fk: 1.3, plants: 2.9, defuses: 0.6, habitConsistency: 85,
    mapsData: [
      { mapName: "Haven", acs: 160, kd: 0.70, kda: "0.81", fkDiff: -5 },
      { mapName: "Fracture", acs: 221, kd: 0.89, kda: "1.15", fkDiff: 3 },
      { mapName: "Breeze", acs: 197, kd: 0.94, kda: "1.25", fkDiff: -3 },
      { mapName: "Lotus", acs: 274, kd: 1.41, kda: "1.71", fkDiff: -2 },
      { mapName: "Pearl", acs: 210, kd: 1.18, kda: "1.38", fkDiff: 1 },
      { mapName: "Split", acs: 153, kd: 0.80, kda: "1.20", fkDiff: -5 },
    ],
    vlrAgents: [{ agentName: "Omen", usePercent: "42%", rounds: 434, rating: 1.12, acs: 203, kd: 1.26, adr: 132.9, kast: "71%", kpr: 0.73, apr: 0.17, fkpr: 0.16, fdpr: 0.11 }]
  },
  "Nyssan": {
    id: "2",
    name: "Nyssan",
    role: "Iniciador",
    games: 26, acs: 215, kd: 1.17, k: 18.9, d: 16.2, a: 5.2, fk: 3.5, plants: 1.4, defuses: 0.7, habitConsistency: 70,
    mapsData: [
      { mapName: "Haven", acs: 129, kd: 0.46, kda: "0.80", fkDiff: -1 },
      { mapName: "Fracture", acs: 166, kd: 0.97, kda: "1.37", fkDiff: 4 },
      { mapName: "Breeze", acs: 153, kd: 1.45, kda: "2.00", fkDiff: -1 },
      { mapName: "Lotus", acs: 194, kd: 1.21, kda: "1.29", fkDiff: 4 },
      { mapName: "Pearl", acs: 141, kd: 1.01, kda: "1.73", fkDiff: -1 },
      { mapName: "Split", acs: 123, kd: 0.83, kda: "1.25", fkDiff: -3 },
    ],
    vlrAgents: [{ agentName: "Fade", usePercent: "50%", rounds: 310, rating: 1.15, acs: 210, kd: 1.18, adr: 138.5, kast: "74%", kpr: 0.74, apr: 0.22, fkpr: 0.12, fdpr: 0.08 }]
  },
  "Peanut": {
    id: "3",
    name: "Peanut",
    role: "Centinela",
    games: 25, acs: 200, kd: 0.92, k: 17.0, d: 18.4, a: 4.2, fk: 3.8, plants: 0.6, defuses: 0.2, habitConsistency: 90,
    mapsData: [
      { mapName: "Haven", acs: 122, kd: 0.46, kda: "0.83", fkDiff: -1 },
      { mapName: "Fracture", acs: 194, kd: 0.94, kda: "1.64", fkDiff: 0 },
      { mapName: "Breeze", acs: 292, kd: 2.18, kda: "3.64", fkDiff: 2 },
      { mapName: "Lotus", acs: 202, kd: 1.00, kda: "2.12", fkDiff: -1 },
      { mapName: "Pearl", acs: 215, kd: 1.15, kda: "1.92", fkDiff: -4 },
      { mapName: "Split", acs: 149, kd: 0.80, kda: "1.07", fkDiff: 1 },
    ],
    vlrAgents: [{ agentName: "Killjoy", usePercent: "60%", rounds: 410, rating: 1.04, acs: 195, kd: 0.95, adr: 128.2, kast: "72%", kpr: 0.68, apr: 0.12, fkpr: 0.08, fdpr: 0.09 }]
  },
  "Mioli": {
    id: "4",
    name: "Mioli",
    role: "Duelista",
    games: 26, acs: 189, kd: 1.10, k: 15.1, d: 16.9, a: 6.5, fk: 1.8, plants: 1.7, defuses: 0.3, habitConsistency: 95,
    mapsData: [
      { mapName: "Haven", acs: 174, kd: 0.94, kda: "1.42", fkDiff: -2 },
      { mapName: "Fracture", acs: 209, kd: 1.23, kda: "1.89", fkDiff: 1 },
      { mapName: "Breeze", acs: 150, kd: 0.81, hda: "1.13", fkDiff: -1 },
      { mapName: "Lotus", acs: 272, kd: 1.44, kda: "1.81", fkDiff: 4 },
      { mapName: "Pearl", acs: 169, kd: 1.14, kda: "1.68", fkDiff: 0 },
      { mapName: "Split", acs: 176, kd: 1.33, kda: "1.92", fkDiff: -2 },
    ],
    vlrAgents: [{ agentName: "Neon", usePercent: "70%", rounds: 450, rating: 1.22, acs: 240, kd: 1.28, adr: 158.4, kast: "78%", kpr: 0.82, apr: 0.15, fkpr: 0.22, fdpr: 0.12 }]
  },
  "Valerie": {
    id: "5",
    name: "Valerie",
    role: "Flex",
    games: 22, acs: 195, kd: 1.05, k: 16.2, d: 15.1, a: 8.4, fk: 1.5, plants: 2.1, defuses: 0.5, habitConsistency: 80,
    mapsData: [
      { mapName: "Haven", acs: 180, kd: 1.10, kda: "1.50", fkDiff: 1 },
      { mapName: "Lotus", acs: 210, kd: 1.02, kda: "1.30", fkDiff: 0 },
    ],
    vlrAgents: [{ agentName: "Gekko", usePercent: "45%", rounds: 240, rating: 1.08, acs: 198, kd: 1.06, adr: 134.1, kast: "75%", kpr: 0.70, apr: 0.40, fkpr: 0.11, fdpr: 0.09 }]
  },
  "Aysheesh": {
    id: "6",
    name: "Aysheesh",
    role: "Controlador",
    games: 24, acs: 183, kd: 0.90, k: 15.1, d: 16.9, a: 6.5, fk: 1.9, plants: 1.7, defuses: 0.3, habitConsistency: 88,
    mapsData: [
      { mapName: "Haven", acs: 161, kd: 0.69, kda: "0.82", fkDiff: -2 },
      { mapName: "Fracture", acs: 248, kd: 1.05, kda: "1.54", fkDiff: 2 },
    ],
    vlrAgents: [{ agentName: "Cypher", usePercent: "80%", rounds: 380, rating: 1.01, acs: 185, kd: 0.92, adr: 122.5, kast: "70%", kpr: 0.63, apr: 0.10, fkpr: 0.07, fdpr: 0.08 }]
  }
}