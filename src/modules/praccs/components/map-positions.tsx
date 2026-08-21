"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
// 🚀 Importamos getMapMinimap (que ya lo tienes) y AGENT_FULL_ICONS
import { AGENT_FULL_ICONS, getMapMinimap } from "@/config/valorant-assets"

interface MapPositionsProps {
  mapName: string
  currentRound: number
  rawTimelineData?: any
  onEventClick?: (seconds: number) => void
}

export default function MapPositions({ mapName = "Pearl", currentRound, rawTimelineData, onEventClick }: MapPositionsProps) {
  const [selectedEventIdx, setSelectedEventIdx] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })

  const roundsDetails = rawTimelineData?.detallesPorRondaCompleta || []
  const roundData = roundsDetails.find((r: any) => r.ronda === currentRound)

  const defaultFeed = [
    { clock: "30.6s", seconds: 30.6, event: "Jett eliminó a Fade", x: 35.5, y: 28.4, type: "kill", killerAgent: "Jett" },
    { clock: "40.9s", seconds: 40.9, event: "Astra (Davo) eliminó a Chamber", x: 42.8, y: 45.3, type: "kill", killerAgent: "Astra" },
    { clock: "41.9s", seconds: 41.9, event: "💣 Spike Plantada en A", x: 32.4, y: 31.5, type: "spike", killerAgent: "Astra" },
    { clock: "47.9s", seconds: 47.9, event: "Viper eliminó a Reyna", x: 68.1, y: 63.0, type: "kill", killerAgent: "Viper" },
    { clock: "55.4s", seconds: 55.4, event: "Jett eliminó a Omen", x: 71.7, y: 59.7, type: "kill", killerAgent: "Jett" },
  ]

  const eventLog = roundData?.feedCronologico ?? defaultFeed

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomOrigin({ x, y })
    setZoomLevel(prev => prev === 1 ? 2.2 : 1)
  }

  return (
    <div className="rounded-xl p-5 bg-card border border-border shadow-xl h-full flex flex-col justify-between space-y-4">

      {/* 1. Cabecera Control Interactivos */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3 shrink-0 font-mono">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            🎯 CONTROL INTERACTIVO DE BAJAS & ZOOM
          </h3>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5 font-sans">
            Haz clic en un evento para saltar en la VOD y enfocar la acción en el radar.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-border/60">
          <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.4, 3.5))} className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all cursor-pointer"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.4, 1))} className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all cursor-pointer"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={() => { setZoomLevel(1); setZoomOrigin({ x: 50, y: 50 }); }} className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border-l border-border/40 pl-2 cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* 2. Cuadrícula Interna Segura de 2 Columnas (7/12 y 5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 w-full min-h-0 items-center">

        {/* 🗺️ LADO IZQUIERDO: EL RADAR DEL MAPA */}
        <div className="lg:col-span-7 flex items-center justify-center relative w-full h-full p-1 min-w-[200px] overflow-hidden rounded-2xl bg-slate-950/20 border border-border/30">
          <div 
            onClick={handleMapClick}
            className="relative w-full aspect-square max-h-[380px] rounded-xl overflow-hidden border border-border/80 bg-slate-950 shadow-2xl select-none transition-transform duration-300 ease-out cursor-crosshair"
            style={{
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              transform: `scale(${zoomLevel})`
            }}
          >
            {/* 🛠️ ¡CORREGIDO AQUÍ! Ejecutamos la función pasándole el mapName */}
            <img src={getMapMinimap(mapName)} alt="Radar" className="w-full h-full object-cover pointer-events-none" />
            
            {eventLog.map((ev: any, idx: number) => {
              const isEventSelected = selectedEventIdx === null || selectedEventIdx === idx
              
              // 🧠 Usamos nuestro diccionario dinámico de agentes de forma limpia
              const avatarUrl = AGENT_FULL_ICONS[ev.killerAgent] || "/pjs/default_agente.png"

              return (
                <div
                  key={idx}
                  className={cn(
                    "absolute transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-20",
                    isEventSelected ? "scale-100 opacity-100" : "scale-75 opacity-10"
                  )}
                  style={{ left: `${ev.x}%`, top: `${ev.y}%` }}
                >
                  <div className={cn(
                    "rounded-full border-2 overflow-hidden shadow-md bg-slate-900",
                    zoomLevel > 1.8 ? "h-6 w-6 border" : "h-9 w-9 border-2",
                    ev.killerAgent === "Astra" ? "border-emerald-400" : "border-primary"
                  )}>
                    <img src={avatarUrl} alt="Agente" className="w-full h-full object-cover" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Lado Derecho: Bloque del registro cronológico de bajas */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-2 font-mono text-[10px] bg-slate-950/40 p-4 rounded-xl border border-border/40 h-full max-h-[420px]">
          <div className="px-1 pb-1.5 border-b border-border/30 text-muted-foreground/70 font-bold text-[9px] shrink-0">
            EVENTOS DE LA RONDA (HAZ CLIC PARA CONTROLAR VOD)
          </div>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {eventLog.map((ev: any, idx: number) => {
              const isSelected = selectedEventIdx === idx

              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedEventIdx(isSelected ? null : idx)
                    setZoomOrigin({ x: ev.x, y: ev.y })
                    setZoomLevel(1.8)
                    if (onEventClick) onEventClick(ev.seconds)
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 bg-background/40 cursor-pointer border-border/30 hover:border-primary/50 w-full",
                    isSelected ? "bg-primary/10 border-primary/60 text-foreground ring-1 ring-primary/20 scale-[1.01]" : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-black shrink-0", isSelected ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {ev.clock}
                    </span>
                    <span className="text-foreground/90 font-sans text-xs truncate">{ev.event}</span>
                  </div>
                  <span className="text-[9px] font-bold text-primary tracking-wider uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/10 shrink-0">
                    {ev.killerAgent}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}