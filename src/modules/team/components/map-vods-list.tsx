"use client"

import { Video, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface PraccMatch {
  id: string
  map: string
  scoreUs: number
  scoreEnemy: number
  date: string
  active?: boolean
  title?: string // Campo opcional por si añades notas o títulos
  url?: string   // Campo opcional para el enlace del vídeo
}

const mapCardBackgrounds: Record<string, string> = {
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

interface MapVodsListProps {
  activeMap: string
  // 🔗 Puedes pasarle el array praccsHistory directamente desde el componente padre
  externalPraccsData?: PraccMatch[] 
}

export function MapVodsList({ activeMap, externalPraccsData }: MapVodsListProps) {
  
  // 📋 Estructura idéntica y enlazada con tu módulo de praccs (fallback interno)
  const localPraccsHistory: PraccMatch[] = [
    { id: "1", map: "Pearl", scoreUs: 13, scoreEnemy: 4, date: "Hoy - Oficial", active: true },
    { id: "2", map: "Ascent", scoreUs: 11, scoreEnemy: 13, date: "Ayer - Scrim KPI", active: false },
    { id: "3", map: "Bind", scoreUs: 13, scoreEnemy: 10, date: "12 Jun - Scrim Case", active: false },
    { id: "4", map: "Haven", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
    { id: "5", map: "Fracture", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
  ]

  // Consumimos tus datos reales del módulo si nos los pasas, si no usamos el histórico base
  const finalData = externalPraccsData || localPraccsHistory

  // Filtrado reactivo síncrono según el mapa activo en el dashboard superior
  const filteredMatches = finalData.filter(
    (match) => activeMap === "ALL" || match.map.toLowerCase() === activeMap.toLowerCase()
  )

  return (
    <div className="space-y-3 w-full">
      <div className="text-cyan-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 pl-1">
        <Video className="h-3.5 w-3.5" />
        <span>VODs de Scrims Analizadas - {activeMap === "ALL" ? "Pool Global" : activeMap.toUpperCase()}</span>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-xl p-4 text-center text-muted-foreground font-mono text-[10px] uppercase select-none">
          No hay grabaciones de vídeo vinculadas en las praccs de este mapa
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-3 pt-0.5 flex flex-row gap-3 scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent">
          {filteredMatches.map((match) => {
            const isWin = match.scoreUs > match.scoreEnemy

            return (
              <div 
                key={match.id} 
                style={{ height: "140px" }}
                className="relative overflow-hidden bg-slate-950 border border-border/80 hover:border-primary/60 rounded-xl p-3 flex flex-col justify-between transition-all duration-200 group shadow-lg w-[320px] sm:w-[350px] shrink-0"
              >
                {/* Imagen de fondo adaptada al mapa exacto */}
                <img 
                  src={mapCardBackgrounds[match.map] || "/maps/ascent.png"} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none z-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-950/90 z-0" />

                {/* HEADER INTERNO */}
                <div className="flex justify-between items-start z-10 w-full">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono font-bold tracking-wider text-muted-foreground bg-slate-950/80 border border-border/30 px-1.5 py-0.5 rounded uppercase">
                      {match.date}
                    </span>
                    <p className="text-white font-sans font-black text-[12px] tracking-wide uppercase mt-1">
                      {match.map}
                    </p>
                  </div>

                  {/* Punto verde de actividad si la pracc está marcada como active */}
                  {match.active && (
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse border border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </div>

                {/* MARCADOR DE RONDAS NATURALS */}
                <div className="z-10 flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className={cn(
                      "text-lg font-black tracking-tighter",
                      isWin ? "text-emerald-400" : "text-primary"
                    )}>
                      {match.scoreUs}
                    </span>
                    <span className="text-[9px] text-muted-foreground/50 font-bold">vs</span>
                    <span className="text-md font-black text-muted-foreground tracking-tighter">
                      {match.scoreEnemy}
                    </span>
                  </div>

                  <span className="text-[9px] text-muted-foreground/80 max-w-[150px] truncate font-sans font-semibold">
                    {match.title || "Review del Encuentro VOD"}
                  </span>
                </div>

                {/* BOTTOM ACCIÓN PLAY */}
                <div className="flex justify-between items-center border-t border-border/20 pt-2 font-mono text-[8px] z-10 w-full">
                  <span className="text-muted-foreground/60 font-bold">45:00 MINS DURACIÓN</span>
                  
                  <a 
                    href={match.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-950 border border-border hover:border-primary text-muted-foreground hover:text-white px-2 py-1 rounded-md flex items-center gap-1 transition-all font-bold group-hover:bg-primary/10"
                  >
                    <Play className="h-2.5 w-2.5 fill-current text-primary" />
                    <span>ANALIZAR VOD</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}