"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, AlertTriangle, LayoutDashboard, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { playersDatabase } from "./data/players-database"
import { AGENT_FULL_ICONS } from "@/config/valorant-assets"
import { PlayerTrackerProfile } from "./components/player-tracker-profile"

type PlayerSubTab = "metrics" | "habits"

interface LocalHabitTask {
  id: string
  name: string
  completed: boolean
  category: "Real-Life" | "In-Game"
}

const mainPlayerAgent: Record<string, { name: string; icon: string }> = {
  "xKittyx": { name: "Omen", icon: AGENT_FULL_ICONS.Omen || "/pjs/omen.png" },
  "Nyssan": { name: "Fade", icon: AGENT_FULL_ICONS.Fade || "/pjs/fade.png" },
  "Peanut": { name: "Killjoy", icon: AGENT_FULL_ICONS.Killjoy || "/pjs/killjoy.png" },
  "Mioli": { name: "Neon", icon: AGENT_FULL_ICONS.Neon || "/pjs/neon.png" },
  "Valerie": { name: "Gekko", icon: AGENT_FULL_ICONS.Gekko || "/pjs/gekko.png" },
  "Aysheesh": { name: "Cypher", icon: AGENT_FULL_ICONS.Cypher || "/pjs/cypher.png" }
}

// 1. Añadimos la interfaz para recibir el jugador desde la URL
interface TeamPlayersDashboardProps {
  selectedPlayer?: string
}

export function TeamPlayersDashboard({ selectedPlayer }: TeamPlayersDashboardProps) {
  const router = useRouter()
  const [playerSubTab, setPlayerSubTab] = useState<PlayerSubTab>("metrics")

  const [playerHabits, setPlayerHabits] = useState<LocalHabitTask[]>([
    { id: "h1", name: "Descanso óptimo & Hidratación", completed: true, category: "Real-Life" },
    { id: "h2", name: "Calentamiento físico / Estiramientos", completed: false, category: "Real-Life" },
    { id: "h3", name: "Aim Training (Routine Voltaic/Aimlabs)", completed: true, category: "In-Game" },
    { id: "h4", name: "VOD Review individual (Mínimo 1 mapa)", completed: true, category: "In-Game" },
    { id: "h5", name: "Comunicación activa y concisa en scrims", completed: false, category: "In-Game" },
  ])

  const playerKeys = Object.keys(playersDatabase)
  
  // 2. Buscamos el jugador real ignorando mayúsculas/minúsculas de la URL
  const actualPlayerKey = selectedPlayer 
    ? playerKeys.find(k => k.toLowerCase() === selectedPlayer.toLowerCase()) 
    : null

  // 3. Determinamos el modo de vista de forma automática
  const viewMode = actualPlayerKey ? "single-player" : "all-team"
  const p = actualPlayerKey ? playersDatabase[actualPlayerKey] : null

  const toggleHabit = (id: string) => {
    setPlayerHabits(playerHabits.map(h => h.id === id ? { ...h, completed: !h.completed } : h))
  }

  return (
    <div className="space-y-5 font-mono text-xs text-foreground select-none animate-fade-in w-full">

      {/* ↩️ BOTÓN DE RETORNO ESTILO PRACCS (Ahora es un Link) */}
      {viewMode === "single-player" && (
        <div className="w-full flex justify-start animate-fade-in">
          <Link
            href="/dashboard/players"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-slate-900/60 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/50 hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Volver al general</span>
          </Link>
        </div>
      )}

      {/* 🧭 MENÚ HORIZONTAL ORIGINAL (Ahora usan Link en lugar de button) */}
      <nav className="w-full bg-card/10 border border-border/30 p-2.5 rounded-xl">
        <ul className="w-full flex flex-row flex-wrap lg:flex-nowrap gap-3 items-center justify-between">
          {playerKeys.map((key) => {
            const pl = playersDatabase[key]
            const isSelected = actualPlayerKey === key
            const agent = mainPlayerAgent[key]

            return (
              <li key={key} className="flex-1 min-w-[160px] sm:min-w-[180px] w-full">
                <Link
                  href={`/dashboard/players/${key.toLowerCase()}`}
                  className={cn(
                    "h-20 w-full rounded-xl border flex flex-col justify-between p-4 transition-all relative overflow-hidden group text-left shadow-sm block",
                    isSelected
                      ? "border-primary text-white font-black shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-slate-900/80"
                      : "bg-slate-950/50 border-border/40 text-muted-foreground/80 hover:text-white hover:border-border/70"
                  )}
                >
                  {agent && (
                    <>
                      <img
                        src={agent.icon}
                        alt=""
                        className="absolute right-0 top-0 bottom-0 h-full w-24 object-cover opacity-45 group-hover:opacity-60 transition-all duration-300 pointer-events-none select-none z-0"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/75 to-transparent z-0" />
                    </>
                  )}

                  <div className="flex justify-between items-center w-full z-10 relative">
                    <span className="uppercase text-[12px] font-bold tracking-wide group-hover:text-white transition-colors">
                      {pl.name}
                    </span>
                    {pl.isIgl && (
                      <span className="text-[7px] font-black tracking-widest text-primary bg-primary/20 border border-primary/40 px-1.5 py-0.5 rounded uppercase">
                        IGL
                      </span>
                    )}
                  </div>

                  <div className="w-full flex justify-baseline mt-auto z-10 relative">
                    <span className="text-[10px] font-black uppercase tracking-tight opacity-75 bg-slate-950/90 border border-border/20 px-1.5 py-0.5 rounded">
                      {pl.role}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 📊 PANEL DE CONTENIDO INFERIOR */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xl w-full min-h-[400px]">
        
        {/* MODO ALL TEAM */}
        {viewMode === "all-team" && (
          <div className="space-y-5 w-full">
            <div className="border-b border-border/40 pb-2">
              <p className="text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                <span>Roster Global Performance Board</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="bg-slate-950/50 border border-border/40 p-4 rounded-xl">
                <p className="text-muted-foreground/70 text-[9px] font-bold uppercase">Mejor K/D Individual</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">1.22 K/D</p>
                <p className="text-[10px] text-white/60 font-sans mt-0.5">xKittyx</p>
              </div>
              <div className="bg-slate-950/50 border border-border/40 p-4 rounded-xl">
                <p className="text-muted-foreground/70 text-[9px] font-bold uppercase">Efectividad de Rutinas</p>
                <p className="text-2xl font-black text-amber-400 mt-1">Mioli (95%)</p>
              </div>
              <div className="bg-slate-950/50 border border-border/40 p-4 rounded-xl">
                <p className="text-muted-foreground/70 text-[9px] font-bold uppercase">Mejor Crecimiento</p>
                <p className="text-2xl font-black text-cyan-400 mt-1">Peanut</p>
              </div>
              <div className="bg-slate-950/50 border border-border/40 p-4 rounded-xl">
                <p className="text-muted-foreground/70 text-[9px] font-bold uppercase">Aperturas Globales (FK)</p>
                <p className="text-2xl font-black text-primary mt-1">Nyssan (3.5)</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse font-sans text-[11px]">
                  <thead>
                    <tr className="border-b border-border/30 font-mono text-[9px] text-muted-foreground uppercase">
                      <th className="pb-2">Player</th>
                      <th className="pb-2 text-center">Games</th>
                      <th className="pb-2 text-center text-cyan-400">ACS</th>
                      <th className="pb-2 text-center text-emerald-400">K/D</th>
                      <th className="pb-2 text-center">K</th>
                      <th className="pb-2 text-center">D</th>
                      <th className="pb-2 text-center text-primary">FK</th>
                      <th className="pb-2 text-center text-amber-400">PLT</th>
                      <th className="pb-2 text-center text-purple-400">DEF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 font-mono">
                    {playerKeys.map((key) => {
                      const pl = playersDatabase[key]
                      const ag = mainPlayerAgent[key]
                      return (
                        <tr 
                          key={pl.id} 
                          // 4. Usamos el enrutador para viajar al jugador cuando se hace clic en la fila
                          onClick={() => router.push(`/dashboard/players/${key.toLowerCase()}`)} 
                          className="hover:bg-slate-950/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-2.5 font-bold text-white uppercase flex items-center gap-2 text-xs">
                            {ag && <img src={ag.icon} alt="" className="h-5 w-5 rounded bg-slate-900 border border-border/40" />}
                            <span>{pl.name}</span>
                          </td>
                          <td className="py-2.5 text-center text-muted-foreground/80">{pl.games}</td>
                          <td className="py-2.5 text-center font-black text-cyan-400">{pl.acs}</td>
                          <td className={cn("py-2.5 text-center font-black", pl.kd >= 1.10 ? "text-emerald-400" : "text-primary")}>{pl.kd.toFixed(2)}</td>
                          <td className="py-2.5 text-center text-foreground">{pl.k}</td>
                          <td className="py-2.5 text-center text-muted-foreground/60">{pl.d}</td>
                          <td className="py-2.5 text-center font-bold text-primary bg-primary/5">{pl.fk}</td>
                          <td className="py-2.5 text-center font-bold text-amber-400">{pl.plants}</td>
                          <td className="py-2.5 text-center font-bold text-purple-400">{pl.defuses}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODO SINGLE PLAYER */}
        {viewMode === "single-player" && p && (
          <div className="space-y-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-3 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded overflow-hidden border border-border/40 bg-slate-950">
                <img 
                  src={actualPlayerKey ? mainPlayerAgent[actualPlayerKey]?.icon : undefined}
                  alt="" 
                  className="h-full w-full object-cover" 
                  />
                </div>
                <span className="text-white text-sm font-black uppercase tracking-wider">{p.name} · Panel de Control</span>
              </div>

              <div className="flex bg-slate-950 p-0.5 border border-border/40 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                <button onClick={() => setPlayerSubTab("metrics")} className={cn("px-2.5 py-1 rounded-md transition-all", playerSubTab === "metrics" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60")}>Stats de Rendimiento</button>
                <button onClick={() => setPlayerSubTab("habits")} className={cn("px-2.5 py-1 rounded-md transition-all", playerSubTab === "habits" ? "bg-slate-900 border border-border/60 text-white" : "text-muted-foreground/60")}>Rutinas & Follow-up</button>
              </div>
            </div>

            {playerSubTab === "metrics" && (
              <div className="w-full animate-fade-in">
                <PlayerTrackerProfile playerName={p.name} />
              </div>
            )}

            {playerSubTab === "habits" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full">
                <div className="bg-slate-950/30 border border-border/30 rounded-xl p-4 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                    <p className="text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Daily Habits Tracker</p>
                    <span className="text-[9px] text-emerald-400 font-bold">Consistencia: {p.habitConsistency}%</span>
                  </div>
                  <div className="space-y-1.5">
                    {playerHabits.map((h) => (
                      <div key={h.id} onClick={() => toggleHabit(h.id)} className={cn("flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all duration-150 font-sans text-[11px]", h.completed ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-slate-950/60 border-border/20 text-muted-foreground/70")}>
                        <div className="flex items-center gap-2">
                          {h.completed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />}
                          <span className={h.completed ? "line-through opacity-60" : ""}>{h.name}</span>
                        </div>
                        <span className="text-[7px] font-mono font-black border px-1 py-0.5 rounded uppercase bg-slate-900">{h.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/30 border border-border/30 rounded-xl p-4 space-y-3">
                  <p className="text-primary font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Mistake Tracker</p>
                  <div className="space-y-2 font-sans text-[11px]">
                    <div className="bg-slate-950/80 p-2.5 border border-border/20 rounded-lg flex justify-between items-center">
                      <div className="space-y-0.5"><p className="text-white font-bold leading-tight">Forzar compra para OP en rondas de eco</p><span className="text-[8px] font-mono text-muted-foreground uppercase bg-slate-900 px-1 border rounded">Ascent</span></div>
                      <span className="text-[8px] font-mono font-black bg-red-500/10 border border-red-500/30 text-primary px-1.5 py-0.5 rounded uppercase">Critical</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}