"use client"

import { useMemo } from "react"
import { Shield, Swords, Coins, TrendingUp, CheckCircle2, XCircle } from "lucide-react"

interface TypeRoundProps {
  rawTimelineData: any
}

export function TypeRound({ rawTimelineData }: TypeRoundProps) {
  const statsEconomicas = useMemo(() => {
    const rondasDetails = rawTimelineData?.detallesPorRondaCompleta || []

    let pistolasAtkGanadas = 0, pistolasAtkPerdidas = 0
    let pistolasDefGanadas = 0, pistolasDefPerdidas = 0
    let ecoJugadas = 0, ecoGanadas = 0
    let semiJugadas = 0, semiGanadas = 0
    let fullJugadas = 0, fullGanadas = 0

    if (rondasDetails.length === 0) {
      return {
        pistolas: { atkG: 1, atkP: 0, defG: 1, defP: 0 },
        eco: { jugadas: 3, ganadas: 0, perdadas: 3 },
        semi: { jugadas: 4, ganadas: 2, perdadas: 2 },
        full: { jugadas: 8, ganadas: 7, perdadas: 1 }
      }
    }

    rondasDetails.forEach((r: any) => {
      const falkeSpent = r.gastoTotalFalke || r.falkeSpent || 0
      const rivalSpent = r.gastoTotalRival || r.rivalSpent || 0
      const falkeGano = r.resultado === "🏆 GANADA" || r.falkeWin === true
      const esPistolas = r.ronda === 1 || r.ronda === 13

      const falkeType = falkeSpent <= 4500 ? "ECO" : falkeSpent <= 14500 ? "SEMI" : "FULL"

      if (esPistolas) {
        if (r.ronda === 1) {
          falkeGano ? pistolasAtkGanadas++ : pistolasAtkPerdidas++
        } else if (r.ronda === 13) {
          falkeGano ? pistolasDefGanadas++ : pistolasDefPerdidas++
        }
      }

      if (falkeType === "ECO") {
        ecoJugadas++
        if (falkeGano) ecoGanadas++
      } else if (falkeType === "SEMI") {
        semiJugadas++
        if (falkeGano) semiGanadas++
      } else if (falkeType === "FULL") {
        fullJugadas++
        if (falkeGano) fullGanadas++
      }
    })

    return {
      pistolas: { atkG: pistolasAtkGanadas, atkP: pistolasAtkPerdidas, defG: pistolasDefGanadas, defP: pistolasDefPerdidas },
      eco: { jugadas: ecoJugadas, ganadas: ecoGanadas, perdadas: ecoJugadas - ecoGanadas },
      semi: { jugadas: semiJugadas, ganadas: semiGanadas, perdadas: semiJugadas - semiGanadas },
      full: { jugadas: fullJugadas, ganadas: fullGanadas, perdadas: fullJugadas - fullGanadas }
    }
  }, [rawTimelineData])

  // Función auxiliar para calcular el winrate de forma segura
  const calcWinRate = (ganadas: number, total: number) => {
    if (total === 0) return 0
    return Math.round((ganadas / total) * 100)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none font-mono text-xs">

      {/* 🎯 TARJETA 1: RONDAS DE PISTOLAS */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xl flex flex-col justify-between space-y-3 relative overflow-hidden group">
        <div className="flex items-center justify-between text-muted-foreground/80 font-black text-[10px] tracking-wider">
          <span className="flex items-center gap-1.5"><Swords className="h-3.5 w-3.5 text-amber-500" /> PISTOL RNDS</span>
          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">SPECIAL</span>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1 items-center">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-border/40 text-center backdrop-blur-xs">
            <p className="text-[8px] text-muted-foreground/60 font-bold uppercase tracking-tight">ATK (R1)</p>
            <div className="flex justify-center gap-1 mt-1 text-xs font-black">
              <span className="text-emerald-400">{statsEconomicas.pistolas.atkG}W</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-red-400">{statsEconomicas.pistolas.atkP}L</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-border/40 text-center backdrop-blur-xs">
            <p className="text-[8px] text-muted-foreground/60 font-bold uppercase tracking-tight">DEF (R13)</p>
            <div className="flex justify-center gap-1 mt-1 text-xs font-black">
              <span className="text-emerald-400">{statsEconomicas.pistolas.defG}W</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-red-400">{statsEconomicas.pistolas.defP}L</span>
            </div>
          </div>
        </div>
        <div className="text-[9px] text-muted-foreground/40 text-center font-sans pt-1">Impacto crítico en economía temprana</div>
      </div>

      {/* 📉 TARJETA 2: RONDAS DE ECO */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xl flex flex-col justify-between space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground/80 font-black text-[10px] tracking-wider">
          <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5 text-red-400" /> ECO RNDS</span>
          <span className="text-[10px] font-black text-foreground bg-slate-950/80 px-2 py-0.5 rounded border border-border/40">
            {statsEconomicas.eco.jugadas} <span className="text-[8px] text-muted-foreground font-normal">RNDS</span>
          </span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Rendimiento</p>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> {statsEconomicas.eco.ganadas}</span>
              <span className="text-muted-foreground/20">|</span>
              <span className="flex items-center gap-1 text-red-400"><XCircle className="h-3 w-3" /> {statsEconomicas.eco.perdadas}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-foreground tracking-tighter">{calcWinRate(statsEconomicas.eco.ganadas, statsEconomicas.eco.jugadas)}%</span>
            <p className="text-[8px] text-muted-foreground/60 uppercase font-sans">Win Rate</p>
          </div>
        </div>

        {/* Barra de progreso visual integrada */}
        <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-border/30">
          <div
            className="bg-red-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${calcWinRate(statsEconomicas.eco.ganadas, statsEconomicas.eco.jugadas)}%` }}
          />
        </div>
      </div>

      {/* ⚖️ TARJETA 3: RONDAS DE SEMI */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xl flex flex-col justify-between space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground/80 font-black text-[10px] tracking-wider">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-cyan-400" /> SEMI RNDS</span>
          <span className="text-[10px] font-black text-foreground bg-slate-950/80 px-2 py-0.5 rounded border border-border/40">
            {statsEconomicas.semi.jugadas} <span className="text-[8px] text-muted-foreground font-normal">RNDS</span>
          </span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Rendimiento</p>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> {statsEconomicas.semi.ganadas}</span>
              <span className="text-muted-foreground/20">|</span>
              <span className="flex items-center gap-1 text-red-400"><XCircle className="h-3 w-3" /> {statsEconomicas.semi.perdadas}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-foreground tracking-tighter">{calcWinRate(statsEconomicas.semi.ganadas, statsEconomicas.semi.jugadas)}%</span>
            <p className="text-[8px] text-muted-foreground/60 uppercase font-sans">Win Rate</p>
          </div>
        </div>

        {/* Barra de progreso visual integrada */}
        <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-border/30">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${calcWinRate(statsEconomicas.semi.ganadas, statsEconomicas.semi.jugadas)}%` }}
          />
        </div>
      </div>

      {/* 🔥 TARJETA 4: FULL BUY */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xl flex flex-col justify-between space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground/80 font-black text-[10px] tracking-wider">
          <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> FULL BUY RNDS</span>
          <span className="text-[10px] font-black text-foreground bg-slate-950/80 px-2 py-0.5 rounded border border-border/40">
            {statsEconomicas.full.jugadas} <span className="text-[8px] text-muted-foreground font-normal">RNDS</span>
          </span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Rendimiento</p>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> {statsEconomicas.full.ganadas}</span>
              <span className="text-muted-foreground/20">|</span>
              <span className="flex items-center gap-1 text-red-400"><XCircle className="h-3 w-3" /> {statsEconomicas.full.perdadas}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-emerald-400 tracking-tighter">{calcWinRate(statsEconomicas.full.ganadas, statsEconomicas.full.jugadas)}%</span>
            <p className="text-[8px] text-muted-foreground/60 uppercase font-sans">Win Rate</p>
          </div>
        </div>

        {/* Barra de progreso visual integrada */}
        <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-border/30">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${calcWinRate(statsEconomicas.full.ganadas, statsEconomicas.full.jugadas)}%` }}
          />
        </div>
      </div>

    </div>
  )
}