"use client"

import React, { useState } from "react"
import { Crosshair, Swords, TrendingUp, Activity, LayoutGrid, BarChart2 } from "lucide-react"
import { AGENT_FULL_ICONS } from "@/config/valorant-assets"
import { cn } from "@/lib/utils"

interface PlayerTrackerProfileProps {
  playerName: string
  onBack?: () => void
}

export function PlayerTrackerProfile({ playerName, onBack }: PlayerTrackerProfileProps) {
  const [internalTab, setInternalTab] = useState<"maps" | "matrix">("maps")

  // 📋 PANEL SUPERIOR (Se mantiene intacto tu Tracker.gg unificado)
  const overviewStats = [
    { label: "Damage/Round", value: "165.1", sub: "Top 13.0%", icon: Activity },
    { label: "K/D Ratio", value: "1.10", sub: "Top 27.0%", icon: Swords },
    { label: "Headshot %", value: "24.7%", sub: "Top 27.0%", icon: Crosshair },
    { label: "Win %", value: "44.7%", sub: "Estable", icon: TrendingUp },
  ]

  const gridStats = [
    { label: "Wins", value: "17" },
    { label: "KAST", value: "67.9%" },
    { label: "DDΔ/Round", value: "+16" },
    { label: "Kills", value: "712" },
    { label: "Deaths", value: "650" },
    { label: "Assists", value: "166" },
    { label: "ACS", value: "253.7" },
    { label: "First Bloods", value: "148" },
    { label: "Aces", value: "3" },
  ]

  // 📊 DATOS EXCEL: Resumen unificado por mapas de tu primera captura
  const excelMapsData = [
    { map: "Haven", acs: 160, kd: 0.70, kda: 0.81, fk: -5 },
    { map: "Bind", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
    { map: "Fracture", acs: 221, kd: 0.89, kda: 1.15, fk: 3 },
    { map: "Breeze", acs: 197, kd: 0.94, kda: 1.25, fk: -3 },
    { map: "Ascent", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
    { map: "Icebox", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
    { map: "Lotus", acs: 274, kd: 1.41, kda: 1.71, fk: -2 },
    { map: "Pearl", acs: 210, kd: 1.18, kda: 1.38, fk: 1 },
    { map: "Split", acs: 153, kd: 0.80, kda: 1.20, fk: -5 },
    { map: "Sunset", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
    { map: "Abyss", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
    { map: "Corrode", acs: 0, kd: 0.00, kda: 0.00, fk: 0 },
  ]

  // Lista global de mapas para la cabecera horizontal de la matriz
  const mapHeaders = ["Haven", "Bind", "Fracture", "Breeze", "Ascent", "Icebox", "Lotus", "Pearl", "Split", "Sunset", "Abyss", "Corrode"]

  // 🔮 MATRIZ EXCEL: Rendimiento cruzado Agente x Mapa de tu segunda captura
  const agentMatrixRows = [
    { agent: "Neon", haven: 0.69, bind: 0.00, fracture: 0.87, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 0.80 },
    { agent: "Omen", haven: 0.88, bind: 0.00, fracture: 0.00, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 0.88 },
    { agent: "Cypher", haven: 0.65, bind: 0.00, fracture: 1.62, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 1.12 },
    { agent: "Jett", haven: 0.00, bind: 0.00, fracture: 0.00, breeze: 0.94, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 1.14, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 1.09 },
    { agent: "Raze", haven: 0.00, bind: 0.00, fracture: 0.00, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 1.41, pearl: 0.00, split: 0.80, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 1.13 },
    { agent: "Breach", haven: 0.40, bind: 0.00, fracture: 0.00, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 0.40 },
    { agent: "Sova", haven: 0.45, bind: 0.00, fracture: 0.00, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 0.45 },
    { agent: "Tejo", haven: 0.00, bind: 0.00, fracture: 1.07, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 1.07 },
    { agent: "Brimstone", haven: 0.00, bind: 0.00, fracture: 1.00, breeze: 0.00, ascent: 0.00, icebox: 0.00, lotus: 0.00, pearl: 0.00, split: 0.00, sunset: 0.00, abyss: 0.00, corrode: 0.00, total: 1.00 },
  ]

  // Dinámica de colores de celdas idéntica a tus escalas térmicas del Excel
  const getHeatmapClass = (val: number) => {
    if (val === 0) return "text-muted-foreground/30 bg-transparent"
    if (val >= 1.20) return "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30"
    if (val >= 0.90) return "bg-amber-500/10 text-amber-300 border border-amber-500/20"
    return "bg-primary/10 text-primary border border-primary/20"
  }

  return (
    <div className="space-y-6 font-mono text-foreground animate-fade-in">

      {/* Cabecera con botón de retorno */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <h3 className="text-sm font-black text-primary uppercase tracking-wider">
          📊 PERFORMANCE TRACKER · {playerName}
        </h3>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-bold text-muted-foreground hover:text-primary border border-border/60 bg-slate-950/40 px-2.5 py-1 rounded-md transition-all"
          >
            VOLVER AL ROSTER
          </button>
        )}
      </div>

      {/* 🛡️ PANEL 1: ROSTER OVERVIEW */}
      <div className="rounded-2xl border border-border/60 bg-slate-950/60 p-5 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, i) => (
            <div key={i} className="bg-background/40 border border-border/40 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                <p className="text-[9px] text-emerald-400 font-sans">{stat.sub}</p>
              </div>
              <stat.icon className="h-5 w-5 text-muted-foreground/50 shrink-0" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-9 gap-3 pt-2 border-t border-border/20">
          {gridStats.map((stat, i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-slate-900/40 border border-border/20">
              <p className="text-[9px] text-muted-foreground uppercase truncate font-bold">{stat.label}</p>
              <p className="text-sm font-black text-foreground mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ⚔️ PANEL 2: INTERFAZ DE HOJA DE CÁLCULO AVANZADA INTEGRADA */}
      <div className="rounded-2xl border border-border/60 bg-slate-950/80 p-5 shadow-xl space-y-5">

        {/* Selector de sub-vistas tácticas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/30 pb-3">
          <h4 className="text-xs font-black text-foreground/80 uppercase tracking-widest">
            📈 DATOS DE CAMPAÑA EXTRAÍDOS DE SCRIMS
          </h4>
          <div className="flex bg-slate-950 p-0.5 border border-border/40 rounded-lg text-[9px] font-bold uppercase tracking-wider self-end sm:self-auto">
            <button
              onClick={() => setInternalTab("maps")}
              className={cn("px-3 py-1 rounded-md transition-all flex items-center gap-1.5", internalTab === "maps" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60")}
            >
              <BarChart2 className="h-3 w-3" /> Resumen General Por Mapas
            </button>
            <button
              onClick={() => setInternalTab("matrix")}
              className={cn("px-3 py-1 rounded-md transition-all flex items-center gap-1.5", internalTab === "matrix" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60")}
            >
              <LayoutGrid className="h-3 w-3" /> Matriz Cruzada Agente x Mapa
            </button>
          </div>
        </div>

        {/* CONTENIDO DENTRO DE SUB-TAB 1: TABLA COMPACTA MAPS (Métrica unificada) */}
        {internalTab === "maps" && (
          <div className="overflow-x-auto w-full animate-fade-in">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground text-[10px] uppercase tracking-wider bg-slate-900/30">
                  <th className="pb-3 pt-2 text-left pl-4">Map</th>
                  <th className="pb-3 pt-2 text-cyan-400">ACS Promedio</th>
                  <th className="pb-3 pt-2">K/D General</th>
                  <th className="pb-3 pt-2">KDA Ratio</th>
                  <th className="pb-3 pt-2 pr-4 text-right">First Bloods (FK +-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 font-sans">
                {excelMapsData.map((m, idx) => (
                  <tr key={idx} className="hover:bg-background/40 transition-colors">
                    <td className="py-3 text-left pl-4 font-mono font-black text-white uppercase tracking-tight">{m.map}</td>
                    <td className="py-3 font-mono text-cyan-400 font-bold">{m.acs === 0 ? "-" : m.acs}</td>
                    <td className="py-3 font-mono">
                      <span className={cn("px-2 py-0.5 rounded font-bold", getHeatmapClass(m.kd))}>
                        {m.kd === 0 ? "0,00" : m.kd.toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-medium text-foreground/70">{m.kda === 0 ? "0,00" : m.kda.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 text-right pr-4 font-mono font-bold">
                      {m.fk === 0 ? (
                        <span className="text-muted-foreground/40">0</span>
                      ) : m.fk > 0 ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+{m.fk}</span>
                      ) : (
                        <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{m.fk}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* FILA TOTAL COMPACTA ESTILO EXCEL */}
                <tr className="bg-slate-900/50 border-t border-border font-mono font-black text-xs">
                  <td className="py-3 text-left pl-4 uppercase">Total General</td>
                  <td className="py-3 text-cyan-400">203</td>
                  <td className="py-3 text-emerald-400">0,95</td>
                  <td className="py-3 text-amber-400">1,18</td>
                  <td className="py-3 text-right pr-4 text-primary">-11</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENIDO DENTRO DE SUB-TAB 2: MATRIZ DINÁMICA AGENTE X MAPA */}
        {internalTab === "matrix" && (
          <div className="overflow-x-auto w-full animate-fade-in border border-border/40 rounded-xl bg-slate-950/40 p-1">
            <table className="w-full text-center text-[11px] border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground text-[10px] font-mono uppercase bg-slate-900/60">
                  <th className="py-3 pl-3 text-left font-bold border-r border-border/20">K/D x Agente</th>
                  {mapHeaders.map((h, i) => (
                    <th key={i} className="py-3 font-medium px-1 min-w-[75px]">{h}</th>
                  ))}
                  <th className="py-3 pr-3 font-black border-l border-border/20 text-white bg-slate-900/30">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {agentMatrixRows.map((row, idx) => {
                  const avatar = AGENT_FULL_ICONS[row.agent] || "/pjs/default_agente.png"
                  return (
                    <tr key={idx} className="hover:bg-background/20 transition-colors group">
                      {/* Nombre del Agente + Icono */}
                      <td className="py-2.5 pl-3 text-left font-mono font-bold text-white flex items-center gap-2 border-r border-border/20 bg-slate-950/20">
                        <img src={avatar} alt="" className="h-4 w-4 rounded object-cover border border-border/40 shrink-0" />
                        <span className="group-hover:text-primary transition-colors">{row.agent}</span>
                      </td>

                      {/* Celdas cruzadas con mapeo de estilos del Excel */}
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.haven))}>{row.haven === 0 ? "0,00" : row.haven.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.bind))}>{row.bind === 0 ? "0,00" : row.bind.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.fracture))}>{row.fracture === 0 ? "0,00" : row.fracture.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.breeze))}>{row.breeze === 0 ? "0,00" : row.breeze.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.ascent))}>{row.ascent === 0 ? "0,00" : row.ascent.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.icebox))}>{row.icebox === 0 ? "0,00" : row.icebox.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.lotus))}>{row.lotus === 0 ? "0,00" : row.lotus.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.pearl))}>{row.pearl === 0 ? "0,00" : row.pearl.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.split))}>{row.split === 0 ? "0,00" : row.split.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.sunset))}>{row.sunset === 0 ? "0,00" : row.sunset.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.abyss))}>{row.abyss === 0 ? "0,00" : row.abyss.toFixed(2).replace(".", ",")}</td>
                      <td className={cn("py-2.5 font-mono", getHeatmapClass(row.corrode))}>{row.corrode === 0 ? "0,00" : row.corrode.toFixed(2).replace(".", ",")}</td>

                      {/* Fila Total lateral */}
                      <td className="py-2.5 pr-3 font-mono font-black text-amber-400 bg-slate-900/20 border-l border-border/20">
                        {row.total.toFixed(2).replace(".", ",")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}