"use client"

import { useState, useMemo } from "react"
import { Shield, Swords, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeatmapPositionsProps {
  mapName: string
}

export function HeatmapPositions({ mapName = "Pearl" }: HeatmapPositionsProps) {
  // 🔘 Estado para controlar el filtro activo del Mapa de Calor
  const [activeFilter, setActiveFilter] = useState<"FK" | "FD" | "SPIKE">("FK")

  // 🚀 RÉPLICA EXACTA DE TU SISTEMA DE MINIMAPA LOCAL
  const nombreMapa = String(mapName || "pearl").toLowerCase().trim()
  const minimapUrl = `/maps/${nombreMapa}_minimap.png`

  // 📍 Datos Mockeados calibrados para tu mapa cenital (valores en % de X e Y)
  const heatmapData = useMemo(() => {
    return {
      FK: [
        { id: 1, x: 35.5, y: 28.4, agent: "Jett", weapon: "Vandal", round: 2 },
        { id: 2, x: 42.8, y: 45.3, agent: "Astra", weapon: "Phantom", round: 4 },
        { id: 3, x: 68.1, y: 63.0, agent: "Viper", weapon: "Operator", round: 9 },
        { id: 4, x: 50.5, y: 38.2, agent: "Raze", weapon: "Vandal", round: 12 },
      ],
      FD: [
        { id: 1, x: 38.0, y: 32.0, agent: "Fade", killedBy: "Reyna", round: 1 },
        { id: 2, x: 44.5, y: 48.0, agent: "Chamber", killedBy: "Jett", round: 3 },
        { id: 3, x: 71.7, y: 59.7, agent: "Omen", killedBy: "Raze", round: 7 },
        { id: 4, x: 65.0, y: 60.5, agent: "Reyna", killedBy: "Viper", round: 16 },
      ],
      SPIKE: [
        { id: 1, x: 32.4, y: 31.5, site: "A SITE", defaultPlant: true, round: 4 },
        { id: 2, x: 33.1, y: 30.2, site: "A SITE", defaultPlant: false, round: 11 },
      ]
    }
  }, [])

  const currentPoints = heatmapData[activeFilter]

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xl space-y-4 font-mono text-xs flex flex-col h-full">
      
      {/* HEADER DEL MAPA DE CALOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-4 gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary animate-pulse" /> MAPA DE CALOR ACUMULADO
          </h3>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-sans">
            Zonas de impacto macro en el radar de {mapName}
          </p>
        </div>

        {/* 🔘 SELECTORES MULTI-MÉTRICA (ESTILO SCOREBOARD) */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 text-[11px] self-start sm:self-center">
          <button
            onClick={() => setActiveFilter("FK")}
            className={cn(
              "rounded px-3 py-1.5 font-bold transition-all flex items-center gap-1 uppercase tracking-wider",
              activeFilter === "FK" 
                ? "bg-emerald-500 text-slate-950 shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Swords className="h-3 w-3" /> First Kills
          </button>
          <button
            onClick={() => setActiveFilter("FD")}
            className={cn(
              "rounded px-3 py-1.5 font-bold transition-all flex items-center gap-1 uppercase tracking-wider",
              activeFilter === "FD" 
                ? "bg-red-500 text-slate-950 shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield className="h-3 w-3" /> First Deaths
          </button>
          <button
            onClick={() => setActiveFilter("SPIKE")}
            className={cn(
              "rounded px-3 py-1.5 font-bold transition-all flex items-center gap-1 uppercase tracking-wider",
              activeFilter === "SPIKE" 
                ? "bg-amber-500 text-slate-950 shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            🎯 Spike Plant
          </button>
        </div>
      </div>

      {/* 🗺️ ENTORNO DEL MINIMAPA TÁCTICO */}
      <div className="relative w-full aspect-square max-h-[380px] mx-auto rounded-xl overflow-hidden border border-border/80 bg-slate-950 shadow-2xl select-none flex items-center justify-center group">
        
        <img 
          src={minimapUrl} 
          alt="Radar" 
          className="w-full h-full object-cover pointer-events-none opacity-80 transition-opacity duration-300 group-hover:opacity-90"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* 🌋 RENDERIZADO DE PUNTOS */}
        {currentPoints.map((pt: any) => {
          let pointColor = "bg-emerald-400 shadow-emerald-500/80"
          let pingColor = "bg-emerald-500"
          let tooltipTitle = `FK - Ronda ${pt.round}`
          let tooltipDesc = `${pt.agent} con ${pt.weapon || "Arma"}`

          if (activeFilter === "FD") {
            pointColor = "bg-red-400 shadow-red-500/80"
            pingColor = "bg-red-500"
            tooltipTitle = `FD - Ronda ${pt.round}`
            tooltipDesc = `${pt.agent} muerto por ${pt.killedBy}`
          } else if (activeFilter === "SPIKE") {
            pointColor = "bg-amber-400 shadow-amber-500/80"
            pingColor = "bg-amber-500"
            tooltipTitle = `Spike - Ronda ${pt.round}`
            tooltipDesc = `Plantado en ${pt.site}`
          }

          return (
            <div
              key={pt.id}
              className="absolute group/point cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200 hover:scale-125"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <span className={cn("animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-35 -left-1 -top-1 pointer-events-none", pingColor)} />
              <div className={cn("h-3.5 w-3.5 rounded-full border border-slate-950 shadow-[0_0_10px_3px] relative z-10", pointColor)} />

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-border px-2.5 py-1.5 rounded-lg text-[10px] w-36 pointer-events-none opacity-0 group-hover/point:opacity-100 transition-opacity duration-150 shadow-2xl z-30 font-sans backdrop-blur-md">
                <p className="font-mono font-black text-foreground border-b border-border/40 pb-0.5 uppercase tracking-wide">{tooltipTitle}</p>
                <p className="text-muted-foreground mt-1 text-[9px] leading-tight">{tooltipDesc}</p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-border/40 rotate-45" />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-between items-center text-[9px] text-muted-foreground/40 font-sans pt-1 border-t border-border/20">
        <span>Filtros acumulados del match</span>
        <span>Reutilizando la ruta de renderizado local</span>
      </div>
    </div>
  )
}