"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Crosshair, Bomb, Clock, Users } from "lucide-react"

interface MapTacticalHeatmapProps {
  activeMap: string
  activeSide: "ALL" | "ATK" | "DEF"
}

const ribTacticalData: Record<string, {
  plants: { x: string; y: string; site: string; success: boolean }[]
  timeline: { second: number; kills: number; plants: number }[]
  playersPostPlant: {
    name: string
    avatarColor: string
    positions: { site: string; side: "ATK" | "DEF"; x: string; y: string }[]
  }[]
}> = {
  Ascent: {
    plants: [
      { x: "top-[42%]", y: "left-[73%]", site: "A", success: true },
      { x: "top-[46%]", y: "left-[75%]", site: "A", success: true },
      { x: "top-[39%]", y: "left-[76%]", site: "A", success: false },
      { x: "top-[42%]", y: "left-[25%]", site: "B", success: true },
      { x: "top-[45%]", y: "left-[28%]", site: "B", success: true },
      { x: "top-[38%]", y: "left-[23%]", site: "B", success: false }
    ],
    timeline: [
      { second: 5, kills: 2, plants: 0 },
      { second: 10, kills: 6, plants: 0 },
      { second: 15, kills: 12, plants: 2 },
      { second: 20, kills: 20, plants: 8 },
      { second: 25, kills: 14, plants: 13 },
      { second: 30, kills: 9, plants: 7 },
      { second: 35, kills: 15, plants: 3 },
      { second: 40, kills: 19, plants: 4 },
      { second: 45, kills: 11, plants: 6 },
      { second: 50, kills: 16, plants: 8 },
      { second: 55, kills: 7, plants: 10 },
      { second: 60, kills: 12, plants: 5 },
      { second: 70, kills: 4, plants: 2 },
      { second: 80, kills: 2, plants: 1 },
      { second: 90, kills: 1, plants: 0 }
    ],
    playersPostPlant: [
      {
        name: "bruhbruhfish", avatarColor: "bg-red-500", positions: [
          { site: "A", side: "ATK", x: "top-[38%]", y: "left-[65%]" },
          { site: "A", side: "DEF", x: "top-[45%]", y: "left-[80%]" }
        ]
      },
      {
        name: "geneticzz", avatarColor: "bg-blue-500", positions: [
          { site: "A", side: "ATK", x: "top-[48%]", y: "left-[62%]" },
          { site: "A", side: "DEF", x: "top-[52%]", y: "left-[72%]" }
        ]
      },
      {
        name: "jackal", avatarColor: "bg-emerald-500", positions: [
          { site: "A", side: "ATK", x: "top-[32%]", y: "left-[75%]" },
          { site: "A", side: "DEF", x: "top-[35%]", y: "left-[68%]" }
        ]
      },
      {
        name: "rimuu", avatarColor: "bg-amber-500", positions: [
          { site: "A", side: "ATK", x: "top-[50%]", y: "left-[58%]" },
          { site: "A", side: "DEF", x: "top-[58%]", y: "left-[76%]" }
        ]
      },
      {
        name: "spexleon", avatarColor: "bg-purple-500", positions: [
          { site: "A", side: "ATK", x: "top-[55%]", y: "left-[60%]" },
          { site: "A", side: "DEF", x: "top-[62%]", y: "left-[65%]" }
        ]
      }
    ]
  }
}

export function MapTacticalHeatmap({ activeMap, activeSide }: MapTacticalHeatmapProps) {
  const [subTab, setSubTab] = useState<"PLANTS" | "TIMELINE" | "POSITIONS">("PLANTS")
  const [selectedSite, setSelectedSite] = useState<"A" | "B">("A")
  const [imageError, setImageError] = useState<boolean>(false)

  // Reiniciar el estado del error de imagen cada vez que cambies el mapa activo arriba
  useEffect(() => {
    setImageError(false)
  }, [activeMap, subTab])

  if (activeMap === "ALL") return null

  const data = ribTacticalData[activeMap] || ribTacticalData["Ascent"]

  // 🗺️ CORREGIDO: Ruta adaptada exactamente a tu public/maps/ terminado en _minimap.png
  const minimapPath = `/maps/${activeMap.toLowerCase()}_minimap.png`

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 w-full">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/40 pb-3 gap-3">
        <div className="text-amber-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-2">
          <Crosshair className="h-4 w-4" />
          <span>RIB.gg Advanced Analytics - {activeMap.toUpperCase()}</span>
        </div>

        <div className="flex bg-slate-950 rounded-lg p-0.5 border border-border/40 gap-1 text-[9px] font-black uppercase tracking-wider">
          <button onClick={() => setSubTab("PLANTS")} className={cn("px-2.5 py-1 rounded-md transition-all", subTab === "PLANTS" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60 hover:text-foreground")}>
            <Bomb className="h-3 w-3 inline mr-1" /> Spike Plants
          </button>
          <button onClick={() => setSubTab("TIMELINE")} className={cn("px-2.5 py-1 rounded-md transition-all", subTab === "TIMELINE" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60 hover:text-foreground")}>
            <Clock className="h-3 w-3 inline mr-1" /> Attack Speed
          </button>
          <button onClick={() => setSubTab("POSITIONS")} className={cn("px-2.5 py-1 rounded-md transition-all", subTab === "POSITIONS" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60 hover:text-foreground")}>
            <Users className="h-3 w-3 inline mr-1" /> Setup Players
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        <div className="bg-slate-950/40 border border-border/40 rounded-xl p-4 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Filtro de Zona</span>
              <div className="flex bg-slate-950 rounded border border-border/30 p-0.5 gap-1 text-[9px] font-mono">
                <button onClick={() => setSelectedSite("A")} className={cn("px-2 rounded", selectedSite === "A" ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground")}>A Site</button>
                <button onClick={() => setSelectedSite("B")} className={cn("px-2 rounded", selectedSite === "B" ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground")}>B Site</button>
              </div>
            </div>

            <div className="border-b border-border/20 my-2" />

            {subTab === "PLANTS" && (
              <div className="space-y-2 text-[11px] font-sans">
                <p className="text-white font-bold font-mono text-[10px] uppercase text-amber-400">Distribución de Plantas</p>
                <p className="text-muted-foreground leading-relaxed">Mapeo del punto exacto del pin de la Spike en rondas completadas de scrims.</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px]">
                  <div className="h-2.5 w-2.5 rounded-full bg-black border border-white" /> <span className="text-foreground">Spike Plantada</span>
                </div>
              </div>
            )}

            {subTab === "TIMELINE" && (
              <div className="space-y-2 text-[11px] font-sans">
                <p className="text-white font-bold font-mono text-[10px] uppercase text-cyan-400">Attack Speed Control</p>
                <p className="text-muted-foreground leading-relaxed">Análisis temporal del ritmo de vuestro bando atacante cruzando muertes vs velocidad del plant.</p>
                <div className="space-y-1.5 font-mono text-[9px] uppercase mt-2">
                  <div className="flex items-center gap-2"><div className="h-1 w-4 bg-emerald-500/40 border border-emerald-400" /> <span>Pre-Plant Attacking Kills</span></div>
                  <div className="flex items-center gap-2"><div className="h-0.5 w-4 bg-cyan-500" /> <span>Curva de Ritmo Plants</span></div>
                </div>
              </div>
            )}

            {subTab === "POSITIONS" && (
              <div className="space-y-3 font-mono text-[10px] uppercase">
                <p className="text-amber-400 font-bold font-mono text-[10px]">Ubicación de Players en Plant</p>
                <p className="text-muted-foreground font-sans text-[11px] normal-case leading-relaxed">Coordenadas de los 5 integrantes del equipo en el segundo exacto que se activa la Spike.</p>
                <div className="space-y-1.5 pt-1">
                  {data.playersPostPlant.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 bg-slate-950/60 border border-border/40 p-1.5 rounded-lg">
                      <div className={cn("h-3 w-3 rounded-full shrink-0 shadow-md", p.avatarColor)} />
                      <span className="text-foreground font-bold tracking-tight text-[11px]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950/60 p-2.5 border border-border/40 rounded-lg text-[9px] text-muted-foreground/80 font-sans tracking-tight">
            Filtrando dinámicamente bando <span className="text-primary font-mono font-bold uppercase">{activeSide}</span> en mapa <span className="text-foreground font-mono font-bold uppercase">{activeMap}</span>.
          </div>
        </div>

        <div className="lg:col-span-2 w-full">
          {subTab !== "TIMELINE" ? (
            <div className="relative aspect-square w-full bg-slate-900 border border-border/40 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">

              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />

              {!imageError && (
                <img
                  src={minimapPath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-80 z-10 select-none pointer-events-none transition-opacity duration-300"
                  onError={() => setImageError(true)}
                />
              )}

              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/60 border border-dashed border-border/60 rounded-xl z-10 font-mono text-[10px] text-muted-foreground select-none">
                  <p className="text-primary font-black uppercase tracking-widest mb-1">IMAGEN DE RADAR NO DETECTADA</p>
                  <p className="max-w-[240px] leading-relaxed normal-case font-sans">Asegúrate de tener el archivo <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono text-[9px]">{activeMap.toLowerCase()}_minimap.png</code> dentro de public/maps/</p>
                </div>
              )}

              <div className="absolute top-4 left-4 z-30 bg-slate-950/90 border border-border px-2 py-1 rounded text-[9px] font-mono font-bold uppercase text-white shadow-xl">
                Radar: {activeMap.toUpperCase()} - Site {selectedSite}
              </div>

              {/* SPIKE PLANTS LAYER */}
              {subTab === "PLANTS" && data.plants
                .filter((p) => p.site === selectedSite)
                .map((p, idx) => (
                  <div key={idx} className={cn("absolute z-40 group", p.x, p.y)}>
                    <div className="h-3 w-3 rounded-full bg-black border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-transform group-hover:scale-125 cursor-pointer" />
                    <span className="absolute hidden group-hover:block bg-slate-950 border border-border text-[8px] px-1.5 py-0.5 rounded font-mono font-bold mt-1.5 text-white shadow-2xl z-50 whitespace-nowrap left-1/2 -translate-x-1/2">
                      Spike Pin #{idx + 1}
                    </span>
                  </div>
                ))}

              {/* JUGADORES POSTPLANT LAYER */}
              {subTab === "POSITIONS" && data.playersPostPlant.map((p) => {
                const sideKey = activeSide === "DEF" ? "DEF" : "ATK"
                const pos = p.positions.find((pos) => pos.site === selectedSite && pos.side === sideKey)
                if (!pos) return null

                return (
                  <div key={p.name} className={cn("absolute z-40 group", pos.x, pos.y)}>
                    <div className={cn("h-3.5 w-3.5 rounded-full border-2 border-white shadow-2xl transition-transform group-hover:scale-125 cursor-pointer flex items-center justify-center text-[7px] font-black text-white uppercase", p.avatarColor)}>
                      {p.name.charAt(0)}
                    </div>
                    <span className="absolute bg-slate-950 border border-border text-[8px] px-1.5 py-0.5 rounded font-mono font-bold mt-1.5 text-white shadow-2xl z-50 whitespace-nowrap left-1/2 -translate-x-1/2">
                      {p.name}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            /* TIMELINE HISTOGRAMA */
            <div className="bg-slate-950 rounded-xl border border-border/50 p-5 space-y-4 w-full h-full min-h-[300px] flex flex-col justify-between">
              <div className="flex justify-between items-center font-mono text-[9px] uppercase text-muted-foreground">
                <span>Efectividad en volumen de tiempo</span>
                <span>Intervalos por Segundo (0s - 100s)</span>
              </div>

              <div className="h-48 w-full flex items-end gap-1.5 border-b border-l border-border/40 pb-1 pl-1 relative">
                {data.timeline.map((t, idx) => {
                  const killHeight = (t.kills / 25) * 100
                  const plantCurveBottom = (t.plants / 20) * 100

                  return (
                    <div key={idx} className="flex-1 h-full flex items-end justify-center relative group">
                      <div
                        style={{ height: `${killHeight}%` }}
                        className="w-full bg-emerald-500/10 border-t-2 border-x border-emerald-400/40 rounded-t group-hover:bg-emerald-500/20 transition-all duration-300"
                      />
                      <div
                        style={{ bottom: `${plantCurveBottom}%` }}
                        className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400 z-30 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-transform group-hover:scale-150"
                      />
                      <div className="absolute hidden group-hover:flex flex-col bg-slate-950 border border-border p-1.5 rounded text-[8px] font-mono font-bold text-white shadow-2xl z-50 bottom-full mb-1 whitespace-nowrap">
                        <p className="text-primary font-black">Tiempo: {t.second}s</p>
                        <p className="text-emerald-400">Kills: {t.kills}</p>
                        <p className="text-cyan-400">Plants: {t.plants}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between text-[8px] font-mono text-muted-foreground/80 px-2 uppercase tracking-tighter">
                {data.timeline.map((t) => <span key={t.second}>{t.second}s</span>)}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}