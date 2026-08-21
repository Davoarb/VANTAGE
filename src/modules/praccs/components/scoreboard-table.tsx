"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AGENT_FULL_ICONS } from "@/config/valorant-assets"


interface ValorantPlayer {
  id: string
  agent?: string
  puuid?: string
  agentRole?: string
  kills?: number | string
  deaths?: number | string
  assists?: number | string
  acs?: number | string
  riotPuuid?: string
  kd?: number | string
  adr?: number | string
  hsPercent?: string | number
  kast?: string | number
  fk?: number
  fd?: number
  plants?: number
  defuses?: number
  multikills?: { k2: number; k3: number; k4: number; k5: number }
  clutches?: Record<string, [number, number]>
}


function roleColor(role: string) {
  switch (role) {
    case "Duelista": return "text-primary"
    case "Iniciadora": return "text-amber-400"
    case "Controladora": return "text-sky-400"
    case "Centinela": return "text-emerald-400"
    default: return "text-muted-foreground"
  }
}

export function ScoreboardTable({ players }: { players: ValorantPlayer[] }) {
  const [viewMode, setViewMode] = useState<"main" | "clutches">("main")

  return (
    <div className="space-y-4">
      {/* Selector de Sub-Vista */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 max-w-xs text-[11px]">
        <button
          onClick={() => setViewMode("main")}
          className={cn(
            "flex-1 rounded py-1 font-medium transition-all",
            viewMode === "main" ? "bg-background text-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Métricas Generales
        </button>
        <button
          onClick={() => setViewMode("clutches")}
          className={cn(
            "flex-1 rounded py-1 font-medium transition-all",
            viewMode === "clutches" ? "bg-background text-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Multi-Kills & Clutches Detallado
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/20 font-mono">
                <th className="px-5 py-3 font-medium">🎭 Agente / Roster</th>
                <th className="px-5 py-3 font-medium">Nickname</th>
                {viewMode === "main" ? (
                  <>
                    <th className="px-3 py-3 text-center font-medium">🏅 ACS</th>
                    <th className="px-3 py-3 text-center font-medium">📊 K / D / A</th>
                    <th className="px-3 py-3 text-center font-medium">⚖️ +/-</th>
                    <th className="px-3 py-3 text-center font-medium">📈 K/D</th>
                    <th className="px-3 py-3 text-center font-medium">💥 ADR</th>
                    <th className="px-3 py-3 text-center font-medium">🎯 HS%</th>
                    <th className="px-3 py-3 text-center font-medium">🛡️KAST</th>
                    <th className="px-4 py-3 text-center font-medium">🥊 FK / FD</th>
                    <th className="px-4 py-3 text-center font-medium">🔥 MK</th>
                    <th className="px-5 py-3 text-right font-medium">💣 P / D</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-center font-medium">Multi-Kills Registradas</th>
                    <th className="px-6 py-3 text-right font-medium">Clutches 1vX (Ganados / Disputados)</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {players.map((player, index) => {
                const kills = Number(player.kills) || 0
                const deaths = Number(player.deaths) || 0
                const assists = Number(player.assists) || 0
                const acs = Number(player.acs) || 0
                const diff = kills - deaths

                const kdRatio = player.kd ? Number(player.kd).toFixed(2) : (deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2))
                const adrValue = player.adr || "140.0"
                const hsValue = player.hsPercent ? `${player.hsPercent}%` : "25%"
                const kastValue = player.kast ? `${player.kast}%` : "70%"
                const firstBloods = player.fk ?? 0
                const firstDeaths = player.fd ?? 0
                const totalPlants = player.plants ?? 0
                const totalDefuses = player.defuses ?? 0

                const totalMk = (player.multikills?.k2 ?? 0) + (player.multikills?.k3 ?? 0)

                const playerNick = player.riotPuuid || player.puuid || player.id || `Player ${index + 1}`
                const agentName = player.agent || "Agente"
                const bandoRed = index < 5

                // Buscamos si tenemos la foto del personaje en nuestro diccionario
                const iconPath = AGENT_FULL_ICONS[agentName]

                return (
                  <tr 
                    key={player.id || index} 
                    className="border-b border-border/40 transition-all last:border-0 hover:bg-accent/30 font-sans"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-xs", bandoRed ? "text-red-500" : "text-blue-500")}>
                          {bandoRed ? "🟥" : "🟦"}
                        </span>
                        {/* 📸 FOTO DEL PERSONAJE DINÁMICA */}
                        {iconPath ? (
                          <img
                            src={iconPath} 
                            alt={agentName} 
                            className="h-9 w-9 rounded-md object-cover border border-border bg-muted/50"
                            onError={(e) => {
                              // Si la imagen falla o no existe, mete el fallback de texto para que no explote
                              (e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          /* Fallback por si acaso el agente es nuevo y no tienes la foto todavía */
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold text-foreground border border-border">
                            {agentName.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-foreground tracking-tight">{agentName}</p>
                          <p className={cn("text-[10px] font-semibold uppercase tracking-wider", roleColor(player.agentRole || "Controladora"))}>
                            {player.agentRole || "Controlador"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {playerNick.length > 15 ? `${playerNick.slice(0, 12)}...` : playerNick}
                    </td>

                    {viewMode === "main" ? (
                      <>
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-foreground">{acs}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-foreground">
                          {kills}<span className="text-muted-foreground/50">/</span>{deaths}<span className="text-muted-foreground/50">/</span>{assists}
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span className={cn("font-mono font-bold text-xs px-1.5 py-0.5 rounded", diff > 0 ? "bg-emerald-500/10 text-emerald-400" : diff < 0 ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-center font-mono text-xs text-foreground/90">{kdRatio}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-xs text-foreground/90">{adrValue}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-xs text-emerald-400 font-semibold">{hsValue}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-xs text-sky-400">{kastValue}</td>
                        <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">{firstBloods}</span> / <span className="text-primary font-medium">{firstDeaths}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-xs text-amber-400 font-bold">
                          {totalMk}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">{totalPlants} P</span> / <span className="text-sky-400 font-medium">{totalDefuses} D</span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3.5 text-center font-mono text-xs">
                          <div className="inline-flex gap-3 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-muted-foreground">
                            <span>2K: <strong className="text-foreground">{player.multikills?.k2 ?? 0}</strong></span>
                            <span>3K: <strong className="text-amber-400">{player.multikills?.k3 ?? 0}</strong></span>
                            <span>4K: <strong className="text-orange-400">{player.multikills?.k4 ?? 0}</strong></span>
                            <span>5K: <strong className="text-primary font-black">{player.multikills?.k5 ?? 0}</strong></span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono text-xs">
                          <div className="inline-flex flex-wrap gap-x-3 gap-y-1 justify-end text-muted-foreground max-w-md ml-auto">
                            <span>1v1: <strong className="text-foreground">{player.clutches?.c1v1 ? `${player.clutches.c1v1[0]}/${player.clutches.c1v1[1]}` : "0/0"}</strong></span>
                            <span>1v2: <strong className="text-emerald-400">{player.clutches?.c1v2 ? `${player.clutches.c1v2[0]}/${player.clutches.c1v2[1]}` : "0/0"}</strong></span>
                            <span>1v3: <strong className="text-primary">{player.clutches?.c1v3 ? `${player.clutches.c1v3[0]}/${player.clutches.c1v3[1]}` : "0/0"}</strong></span>
                            <span>1v4: <strong className="text-orange-400">{player.clutches?.c1v4 ? `${player.clutches.c1v4[0]}/${player.clutches.c1v4[1]}` : "0/0"}</strong></span>
                            <span>1v5: <strong className="text-amber-400 font-bold">{player.clutches?.c1v5 ? `${player.clutches.c1v5[0]}/${player.clutches.c1v5[1]}` : "0/0"}</strong></span>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}