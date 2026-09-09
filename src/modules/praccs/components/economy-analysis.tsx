"use client"


interface EconomyAnalysisProps {
  rawTimelineData?: any
  currentRound: number
}

export function EconomyAnalysis({ rawTimelineData, currentRound }: EconomyAnalysisProps) {
  // Buscamos los datos específicos de la ronda activa dentro del JSON del parser
  const roundsDetails = rawTimelineData?.detallesPorRondaCompleta || []
  const roundData = roundsDetails.find((r: any) => r.ronda === currentRound)

  // Si no hay datos reales de esa ronda (ej: mapas mockeados), usamos un fallback idéntico a tu volcado
  const redSpent = roundData?.statsGlobales?.gastoRed ?? (currentRound === 1 ? 3750 : 16150)
  const blueSpent = roundData?.statsGlobales?.gastoBlue ?? (currentRound === 1 ? 3550 : 350)
  const diffSpent = Math.abs(redSpent - blueSpent)

  // Listas simuladas basadas en tus datos reales por si el JSON crudo no trae el bando desglosado
  const defaultOurTeam = [
    { name: "Fade (Player 3)", weapon: currentRound === 1 ? "Ghost" : "Vandal", shield: currentRound === 1 ? "No Shield ❌" : "Shield 25 🛡️", spent: currentRound === 1 ? 750 : 3850, left: currentRound === 1 ? 50 : 0, kills: currentRound === 1 ? 0 : 1 },
    { name: "Jett (Player 7)", weapon: currentRound === 1 ? "Classic" : "Vandal", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "No Shield ❌", spent: currentRound === 1 ? 700 : 3000, left: currentRound === 1 ? 100 : 1500, kills: currentRound === 1 ? 3 : 0 },
    { name: "Vyse (Player 5)", weapon: currentRound === 1 ? "Classic" : "Vandal", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "Shield 25 🛡️", spent: currentRound === 1 ? 500 : 3350, left: currentRound === 1 ? 100 : 50, kills: currentRound === 1 ? 1 : 1 },
    { name: "Astra (Davo #ESP)", weapon: currentRound === 1 ? "Ghost" : "Vandal", shield: currentRound === 1 ? "No Shield ❌" : "Shield 50 🛡️🏆", spent: currentRound === 1 ? 800 : 4100, left: currentRound === 1 ? 0 : 50, kills: currentRound === 1 ? 1 : 3 },
    { name: "Viper (Player 4)", weapon: currentRound === 1 ? "Ghost" : "Vandal", shield: currentRound === 1 ? "No Shield ❌" : "Shield 50 🛡️🏆", spent: currentRound === 1 ? 800 : 4100, left: currentRound === 1 ? 0 : 0, kills: currentRound === 1 ? 0 : 1 },
  ]

  const defaultEnemyTeam = [
    { name: "Astra (Player 8)", weapon: "Classic", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "No Shield ❌", spent: currentRound === 1 ? 550 : 150, left: currentRound === 1 ? 100 : 2050, kills: currentRound === 1 ? 1 : 0 },
    { name: "Jett (Player 1)", weapon: "Classic", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "No Shield ❌", spent: currentRound === 1 ? 700 : 2000, left: currentRound === 1 ? 100 : 2000, kills: currentRound === 1 ? 0 : 1 },
    { name: "Chamber (Player 6)", weapon: "Classic", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "No Shield ❌", spent: currentRound === 1 ? 500 : 200, left: currentRound === 1 ? 100 : 1800, kills: currentRound === 1 ? 0 : 0 },
    { name: "Reyna (Player 10)", weapon: "Ghost", shield: currentRound === 1 ? "No Shield ❌" : "No Shield ❌", spent: currentRound === 1 ? 950 : 200, left: currentRound === 1 ? 50 : 1950, kills: currentRound === 1 ? 0 : 0 },
    { name: "Fade (Player 9)", weapon: "Classic", shield: currentRound === 1 ? "Regen 650 🛡️⚡" : "No Shield ❌", spent: currentRound === 1 ? 700 : 450, left: currentRound === 1 ? 100 : 2000, kills: currentRound === 1 ? 0 : 0 },
  ]

  const ourTeam = roundData?.nuestroEquipo ?? defaultOurTeam
  const enemyTeam = roundData?.equipoRival ?? defaultEnemyTeam

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
          💰 Snapshot Económico · Ronda {currentRound}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Auditoría del loadout, armamento y saldo bancario.</p>
      </div>

      {/* Tira informativa de gasto global */}
      <div className="grid grid-cols-3 gap-2 border border-border/60 rounded-lg p-2.5 bg-muted/20 text-center font-mono text-[11px]">
        <div>
          <p className="text-muted-foreground">RED SPENT</p>
          <p className="font-bold text-red-400">${redSpent}</p>
        </div>
        <div className="border-x border-border/60">
          <p className="text-muted-foreground">BLUE SPENT</p>
          <p className="font-bold text-blue-400">${blueSpent}</p>
        </div>
        <div>
          <p className="text-muted-foreground">⚖️ DIFF</p>
          <p className="font-bold text-amber-400">${diffSpent}</p>
        </div>
      </div>

      {/* Desglose de Jugadoras */}
      <div className="space-y-4 text-[11px] flex-1 flex flex-col justify-center">
        {/* 🟥 NUESTRO TEAM */}
        <div className="space-y-1.5">
          <p className="font-bold text-red-400 font-mono tracking-tight">🟥 FALKE TEAM (Atacantes)</p>
          {ourTeam.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center bg-background/40 p-2 rounded border border-border/40 font-mono">
              <span className="text-foreground font-medium truncate max-w-[120px]">{p.name}</span>
              <div className="flex gap-4 text-muted-foreground">
                <span>🔫 <strong className="text-foreground">{p.weapon}</strong></span>
                <span className="hidden sm:inline">🛡️ {p.shield}</span>
                <span>K: <strong className="text-foreground">{p.kills}</strong></span>
                <span>G: <strong className="text-emerald-400">${p.spent}</strong></span>
                <span>B: <strong className="text-sky-400">${p.left}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* 🟦 ENEMY TEAM */}
        <div className="space-y-1.5 pt-1">
          <p className="font-bold text-blue-400 font-mono tracking-tight">🟦 EQUIPO RIVAL (Defensores)</p>
          {enemyTeam.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center bg-background/40 p-2 rounded border border-border/40 font-mono">
              <span className="text-foreground font-medium truncate max-w-[120px]">{p.name}</span>
              <div className="flex gap-4 text-muted-foreground">
                <span>🔫 <strong className="text-foreground">{p.weapon}</strong></span>
                <span className="hidden sm:inline">🛡️ {p.shield}</span>
                <span>K: <strong className="text-foreground">{p.kills}</strong></span>
                <span>G: <strong className="text-primary">${p.spent}</strong></span>
                <span>B: <strong className="text-sky-400">${p.left}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
