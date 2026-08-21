"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Layers, BarChart3, TrendingUp, Crosshair, Target, ShieldCheck, Bomb, Swords, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// Importaciones Modulares Planas 🚀
import { mapBackgrounds, ACTIVE_MAP_POOL, sheetsDatabase } from "./data/maps-database"
import { MapEconomyChart } from "./components/map-economy-chart"
import { MapSitesAnalysis } from "./components/map-sites-analysis"
import { MapTacticalHeatmap } from "./components/map-tactical-heatmap"
import { MapVodsList } from "./components/map-vods-list"

// 📊 DATABASE DE PRACCS UNIFICADA (Declarada aquí para alimentar a ambos componentes sin errores)
const praccsHistory = [
  { id: "1", map: "Pearl", scoreUs: 13, scoreEnemy: 4, date: "Hoy - Oficial", active: true },
  { id: "2", map: "Ascent", scoreUs: 11, scoreEnemy: 13, date: "Ayer - Scrim KPI", active: false },
  { id: "3", map: "Bind", scoreUs: 13, scoreEnemy: 10, date: "12 Jun - Scrim Case", active: false },
  { id: "4", map: "Haven", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
  { id: "5", map: "Fracture", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
]

export function TeamMapsDashboard() {
  const [activeMap, setActiveMap] = useState<string>("ALL")
  const [activeSide, setActiveSide] = useState<"ALL" | "ATK" | "DEF">("ALL")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [onlyActivePool, setOnlyActivePool] = useState<boolean>(true)
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setActiveSide("ALL")
  }, [activeMap])

  const filteredMaps = useMemo(() => {
    return Object.keys(mapBackgrounds)
      .filter((mapName) => !onlyActivePool || ACTIVE_MAP_POOL.includes(mapName))
      .sort((a, b) => a.localeCompare(b))
  }, [onlyActivePool])

  const currentStats = useMemo(() => {
    return sheetsDatabase[activeMap === "ALL" ? "GLOBAL" : activeMap] || sheetsDatabase.GLOBAL
  }, [activeMap])

  const currentOpeningsTable = useMemo(() => {
    if (activeMap !== "ALL") {
      const ops = sheetsDatabase[activeMap]?.openings || []
      if (activeSide === "ALL") return ops
      return ops.filter((op: any) => op.side === activeSide)
    }
    return [
      { name: "Split", fk: 16, fd: 12, diff: "+4", color: "text-emerald-400" },
      { name: "Haven", fk: 15, fd: 31, diff: "-16", color: "text-primary" },
      { name: "Pearl", fk: 18, fd: 11, diff: "+7", color: "text-emerald-400" },
      { name: "Ascent", fk: 10, fd: 2, diff: "+8", color: "text-emerald-400" },
      { name: "Fracture", fk: 25, fd: 22, diff: "+3", color: "text-emerald-400" },
      { name: "Lotus", fk: 23, fd: 13, diff: "+10", color: "text-emerald-400" },
      { name: "Breeze", fk: 14, fd: 8, diff: "+6", color: "text-emerald-400" },
      { name: "Global / Total", fk: 121, fd: 111, diff: "+10", color: "text-cyan-400", isTotal: true }
    ]
  }, [activeMap, activeSide])

  return (
    <div className="space-y-6 font-mono text-xs text-foreground select-none animate-fade-in w-full">
      
      {/* 🧭 SELECTOR DE MAPA SUPERIOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center bg-card/20 border border-border/40 rounded-xl p-4 w-full gap-4">
        <div className="lg:col-span-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-black text-[11px] tracking-widest text-muted-foreground uppercase">
            FILTRADO DE RENDIMIENTO MACRO
          </span>
        </div>

        <div className="relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ height: "68px" }}
            className={cn(
              "relative overflow-hidden flex items-center justify-center bg-slate-900 border-2 transition-all rounded-xl shadow-2xl tracking-widest group z-10 w-full",
              isOpen ? "border-primary" : "border-border hover:border-primary/75"
            )}
          >
            <img src={activeMap === "ALL" ? "/maps/ascent.png" : mapBackgrounds[activeMap]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/80" />
            <span className="relative z-10 text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">{activeMap === "ALL" ? "All Maps" : activeMap}</span>
          </button>

          {isOpen && (
            <div style={{ width: "320px", maxHeight: "420px" }} className="absolute right-0 mt-2 bg-slate-950 border-2 border-border rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 z-50 overflow-y-auto space-y-2.5">
              <button onClick={() => { setActiveMap("ALL"); setIsOpen(false); }} className={cn("w-full h-11 rounded-lg border-2 font-black uppercase text-xs flex items-center justify-center bg-slate-900/40", activeMap === "ALL" ? "border-primary text-primary bg-primary/10" : "border-border/40 text-muted-foreground")}><BarChart3 className="h-4 w-4 mr-2" /> All Maps</button>
              <div onClick={() => setOnlyActivePool(!onlyActivePool)} className="w-full flex items-center justify-between p-2.5 bg-slate-900/50 border border-border/60 hover:border-border rounded-lg cursor-pointer text-[10px] uppercase font-bold tracking-wider">
                <span className={onlyActivePool ? "text-emerald-400" : "text-muted-foreground"}>Solo Pool Activo</span>
                <div className={cn("h-4 w-4 rounded flex border items-center justify-center", onlyActivePool ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-border/80")}>{onlyActivePool && <span className="h-2 w-2 rounded-full bg-emerald-400" />}</div>
              </div>
              <div className="border-b border-border/30 my-2 opacity-30" />
              <div className="flex flex-col gap-2">
                {filteredMaps.map((mapName) => (
                  <button key={mapName} onClick={() => { setActiveMap(mapName); setIsOpen(false); }} style={{ height: "50px" }} className={cn("relative w-full rounded-xl overflow-hidden border-2 flex items-center justify-center bg-slate-900 group shrink-0", activeMap === mapName ? "border-emerald-500 text-emerald-400 font-black" : "border-border/20 text-white")}>
                    <img src={mapBackgrounds[mapName]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="relative z-10 text-xs tracking-widest uppercase font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{mapName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 TARJETAS MACROESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-card border border-border rounded-xl p-5 shadow-md">
          <div className="text-muted-foreground/70 font-bold text-[9px] uppercase">Win Rate</div>
          <p className="text-3xl font-black mt-2 tracking-tighter">{currentStats.winRate}</p>
          <p className="text-[10px] text-muted-foreground/60 font-sans mt-0.5">{currentStats.won || 13}W - {currentStats.lost || 6}L</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-md">
          <div className="flex justify-between items-center text-muted-foreground/70 font-bold text-[9px] uppercase"><span>Net Rounds</span><TrendingUp className="h-3 w-3 text-emerald-400" /></div>
          <p className={cn("text-3xl font-black mt-2 tracking-tighter", currentStats.roundDiff.startsWith("-") ? "text-primary" : "text-emerald-400")}>{currentStats.roundDiff}</p>
          <p className="text-[10px] text-muted-foreground/60 font-sans mt-0.5">{currentStats.flkRounds} won / {currentStats.enemyRounds} lost</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-md">
          <div className="text-amber-400 font-bold text-[9px] uppercase">ATK Win Rate</div>
          <p className="text-3xl font-black mt-2 tracking-tighter">{currentStats.atkWinRate}</p>
          <p className="text-[10px] text-muted-foreground/60 font-sans mt-0.5">Efectividad de bando</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-md">
          <div className="text-cyan-400 font-bold text-[9px] uppercase">DEF Win Rate</div>
          <p className="text-3xl font-black mt-2 tracking-tighter">{currentStats.defWinRate}</p>
          <p className="text-[10px] text-muted-foreground/60 font-sans mt-0.5">Control de site</p>
        </div>
      </div>

      {/* 📺 CARRUSEL DE VODs HORIZONTAL (Conectado con praccsHistory) */}
      <MapVodsList activeMap={activeMap} externalPraccsData={praccsHistory} />

      {/* 🎛️ SELECTOR DE BANDO */}
      {activeMap !== "ALL" && (
        <div className="flex bg-slate-950/80 border border-border/40 p-1 rounded-xl max-w-xs gap-1">
          {[
            { id: "ALL", label: "Resumen", icon: BarChart3, color: "hover:text-foreground" },
            { id: "ATK", label: "Ataque", icon: Swords, color: "hover:text-amber-400" },
            { id: "DEF", label: "Defensa", icon: Shield, color: "hover:text-cyan-400" }
          ].map((tab) => {
            const isTabActive = activeSide === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveSide(tab.id as any)} className={cn("flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all text-[10px] font-bold uppercase tracking-wider", isTabActive ? tab.id === "ATK" ? "bg-amber-500/10 border border-amber-500/40 text-amber-400" : tab.id === "DEF" ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-400" : "bg-slate-900 border border-border text-foreground" : "text-muted-foreground/60 " + tab.color)}>
                <tab.icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* 🪙 GRÁFICO DE ECONOMÍA - PERMANENTE */}
      <MapEconomyChart currentStats={currentStats} activeMap={activeMap} />

      {/* 🗺️ ANÁLISIS DE SITES + RADAR INTERACTIVO DE RIB.GG */}
      {activeMap !== "ALL" && currentStats.sitesData && (
        <>
          <MapSitesAnalysis sitesData={currentStats.sitesData} activeSide={activeSide} />
          <MapTacticalHeatmap activeMap={activeMap} activeSide={activeSide} />
        </>
      )}

      {/* 🚀 CONDICIONES DE VICTORIA ADAPTATIVAS (Visible en Todos los Bandos) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 lg:col-span-2">
          <div className="text-primary font-black text-[10px] uppercase tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" /> 
            <span>WIN CONDITION DISTRIBUTION - {activeSide === "ALL" ? "GLOBAL" : activeSide}</span>
          </div>
          <div className="space-y-3 font-sans">
            {currentStats.winConditions
              ?.filter((condition: any) => {
                // Filtro inteligente: En ATK no mostramos "Desactivación" y en DEF no mostramos "Detonación"
                if (activeSide === "ATK" && condition.name.includes("(DEF)")) return false
                if (activeSide === "DEF" && condition.name.includes("(ATK)")) return false
                return true
              })
              .map((condition: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold font-mono">
                    <span className="text-foreground">{condition.name}</span>
                    <span className="text-muted-foreground">{condition.pct}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-950/60 rounded-md overflow-hidden border border-border/20">
                    <div style={{ width: `${condition.pct}%` }} className={cn("h-full transition-all duration-500", condition.color)} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-amber-400 font-black text-[10px] uppercase tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
              <Crosshair className="h-3.5 w-3.5" />
              <span>MÉTRICAS CLAVE DE CONTROL</span>
            </div>
            <div className="divide-y divide-border/20 font-mono text-[11px] mt-2">
              {/* Éxito Postplant: Útil en Resumen y Ataque */}
              {(activeSide === "ALL" || activeSide === "ATK") && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Bomb className="h-3 w-3 text-amber-500" /> Éxito Postplant
                  </span>
                  <span className="font-black text-foreground">
                    {activeMap === "ALL" ? sheetsDatabase.GLOBAL.macroTrends.postPlantSuccess : `${sheetsDatabase[activeMap]?.sitesData[0]?.postPlant || 70}%`}
                  </span>
                </div>
              )}

              {/* Éxito Retake: Útil en Resumen y Defensa */}
              {(activeSide === "ALL" || activeSide === "DEF") && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-cyan-500" /> Éxito Retake
                  </span>
                  <span className="font-black text-foreground">
                    {activeMap === "ALL" ? sheetsDatabase.GLOBAL.macroTrends.retakeSuccess : "42.1%"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ⚔️ TABLA DE APERTURAS FILTRADA */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 w-full">
        <div className="text-amber-400 font-black text-[10px] uppercase tracking-wider border-b border-border pb-2 flex justify-between items-center"><span>Control de Primeras Sangres</span><span className="text-[9px] text-muted-foreground/60 font-sans">Filtro activo: {activeSide}</span></div>
        <table className="w-full text-left border-collapse font-sans text-[11px]">
          <thead>
            <tr className="border-b border-border/40 font-mono text-[9px] text-muted-foreground uppercase">
              <th className="pb-2.5 font-bold">{activeMap === "ALL" ? "Mapa" : "Bando / Lado"}</th>
              <th className="pb-2.5 font-bold text-center">First Kills (FK)</th>
              <th className="pb-2.5 font-bold text-center">First Deaths (FD)</th>
              <th className="pb-2.5 font-bold text-right">Diferencia (+/-)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 font-mono">
            {currentOpeningsTable.map((row: any, idx: number) => (
              <tr key={idx} className={cn("hover:bg-slate-950/40 transition-colors", row.isTotal ? "bg-slate-950/60 font-black border-t-2" : "")}>
                <td className="py-2.5 font-bold text-foreground">{row.name}</td>
                <td className="py-2.5 text-center text-muted-foreground">{row.fk}</td>
                <td className="py-2.5 text-center text-muted-foreground">{row.fd}</td>
                <td className={cn("py-2.5 text-right font-black", row.color)}>{row.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟥 MÓDULOS DE PISTOLAS */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-lg">
        <div className="text-emerald-400 font-black text-[10px] uppercase tracking-wider border-b border-border pb-1.5">CONTROL EN RONDAS DE PISTOLAS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(activeSide === "ALL" || activeSide === "ATK") && (
            <div className="bg-slate-950/60 border border-border/40 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">Pistolas ATK</p>
              <p className="text-foreground text-sm font-black mt-0.5">{currentStats.pistolAtk}</p>
            </div>
          )}
          {(activeSide === "ALL" || activeSide === "DEF") && (
            <div className="bg-slate-950/60 border border-border/40 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">Pistolas DEF</p>
              <p className="text-foreground text-sm font-black mt-0.5">{currentStats.pistolDef}</p>
            </div>
          )}
        </div>
      </div>

      {/* 📊 BLOQUE CRÍTICO GLOBAL ABAJO */}
      {activeMap === "ALL" && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-lg">
          <div className="text-amber-400 font-black text-[10px] uppercase tracking-wider border-b border-border pb-1.5">ANÁLISIS DE RENDIMIENTO CRÍTICO EN POOL GLOBAL</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-slate-950/40 border border-border/40 rounded-lg p-3"><p className="text-[9px] text-muted-foreground uppercase font-bold">Mejor Mapa Pistola ATK</p><p className="text-emerald-400 font-black text-xs mt-1">{sheetsDatabase.GLOBAL.bestPistolAtk}</p></div>
              <div className="bg-slate-950/40 border border-border/40 rounded-lg p-3"><p className="text-[9px] text-muted-foreground uppercase font-bold">Mejor Mapa Pistola DEF</p><p className="text-emerald-400 font-black text-xs mt-1">{sheetsDatabase.GLOBAL.bestPistolDef}</p></div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-950/40 border border-border/40 rounded-lg p-3"><p className="text-[9px] text-amber-400 uppercase font-bold">Mejor Mapa Global</p><p className="text-emerald-400 font-black text-xs mt-1">Split / Ascent / Lotus (100%)</p></div>
              <div className="bg-slate-950/40 border border-border/40 rounded-lg p-3"><p className="text-[9px] text-primary uppercase font-bold">Alerta: Peor Mapa Global</p><p className="text-primary font-black text-xs mt-1">Haven (25% WR)</p></div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}