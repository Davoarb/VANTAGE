// 🛡️ MOLDES ESTRICTOS (INTERFACES) PARA EL JSON DE RIOT GAMES
// Basado en la captura real del "Vantage Recorder" (Motor V2)

export interface MatchInfo {
    matchId: string;
    mapId: string;
    gameLengthMillis: number;
    gameStartMillis: number;
    queueID: string;
    isCompleted: boolean;
}

export interface PlayerEconomy {
    loadoutValue: number;
    weapon: string;
    armor: string;
    remaining: number;
    spent: number;
}

export interface DamageEvent {
    receiver: string; // ID del jugador que recibe el daño
    damage: number;
    legshots: number;
    bodyshots: number;
    headshots: number;
}

export interface Location {
    x: number;
    y: number;
}

export interface PlayerLocation {
    subject: string;
    viewRadians: number;
    location: Location;
}

export interface KillEvent {
    gameTime: number;
    roundTime: number;
    killer: string;
    victim: string;
    victimLocation: Location;
    assistants: string[];
    playerLocations: PlayerLocation[];
    finishingDamage: {
        damageType: string;
        damageItem: string;
        isSecondaryFireMode: boolean;
    }
}

export interface PlayerRoundStats {
    subject: string; // ID del jugador
    kills: KillEvent[];
    damage: DamageEvent[];
    score: number;
    economy: PlayerEconomy;
    wasAfk: boolean;
    stayedInSpawn: boolean;
}

export interface RoundResult {
    roundNum: number;
    roundResult: string; // "Eliminated", "Bomb defused", "Bomb detonated"
    winningTeam: "Red" | "Blue";
    bombPlanter?: string;
    bombDefuser?: string;
    firstBloodPlayer?: string;
    plantRoundTime: number;
    plantLocation: Location;
    plantSite: string; // "A", "B", "C"
    defuseRoundTime: number;
    defuseLocation: Location;
    playerStats: PlayerRoundStats[];
}

export interface PlayerGlobalStats {
    subject: string;
    teamId: "Red" | "Blue";
    characterId: string; // ID del Agente
    stats: {
        score: number;
        roundsPlayed: number;
        kills: number;
        deaths: number;
        assists: number;
    };
    competitiveTier: number;
}

// 📦 EL OBJETO MAESTRO QUE RECIBIRÁ TU BOTÓN "SUBIR PRACC"
export interface RiotMatchData {
    matchInfo: MatchInfo;
    players: PlayerGlobalStats[];
    roundResults: RoundResult[];
}