"use client"

import { cn } from "@/lib/utils"
import { Calendar, Swords, Shield, ExternalLink } from "lucide-react"

interface PraccMatch {
  id: string
  date: string
  opponent: string
  map: string
  scoreFlk: number
  scoreEnemy: number
  result: "WIN" | "LOSS"
  sideStart: "ATK" | "DEF"
}

// Historial ficticio enlazado (luego se conectará con tu hook de praccs)
const recentPraccsMock: PraccMatch[] = [
  { id: "1", date: "22/06", opponent: "KPI Gaming", map: "Split", scoreFlk: 13, scoreEnemy: 5, result: "WIN", sideStart: "ATK" },
  { id: "2", date: "20/06", opponent: "UCAM Esports", map: "Haven", scoreFlk: 8, scoreEnemy: 13, result: "LOSS", sideStart: "DEF" },
  { id: "3", date: "19/06", opponent: "Barça eSports", map: "Lotus", scoreFlk: 13, scoreEnemy: 11, result: "WIN", sideStart: "ATK" },
  { id: "4", date: "18/06", opponent: "Movistar KOI", map: "Ascent", scoreFlk: 13, scoreEnemy: 7, result: "WIN", sideStart: "ATK" },
  { id: "5", date: "15/06", opponent: "Case Esports", map: "Haven", scoreFlk: 11, scoreEnemy: 13, result: "LOSS", sideStart: "ATK" },
]

interface MapRecentPraccsTableProps {
  activeMap: string
}

export function MapRecentPraccsTable({ activeMap }: MapRecentPraccsTableProps) {
  const filteredPraccs = recentPraccsMock.filter(
    (pracc) => activeMap === "ALL" || pracc.map.toLowerCase() === activeMap.toLowerCase()
  )

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 w-full">
      <div className="text-primary font-black text-[10px] uppercase tracking-wider border-b border-border pb-2 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>Historial de Últimas Praccs - {activeMap === "ALL" ? "Global" : activeMap.toUpperCase()}</span>
        </div>
        <span className="text-[9px] text-muted-foreground/60 font-sans">
          {filteredPraccs.length} praccs encontradas
        </span>
      </div>

      {filteredPraccs.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
          No hay registros recientes para este mapa
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse font-sans text-[11px]">
            <thead>
              <tr className="border-b border-border/40 font-mono text-[9px] text-muted-foreground uppercase">
                <th className="pb-2.5 font-bold">Fecha</th>
                <th className="pb-2.5 font-bold">Rival</th>
                {activeMap === "ALL" && <th className="pb-2.5 font-bold text-center">Mapa</th>}
                <th className="pb-2.5 font-bold text-center">Bando Inicial</th>
                <th className="pb-2.5 font-bold text-center">Resultado</th>
                <th className="pb-2.5 font-bold text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 font-mono">
              {filteredPraccs.map((pracc) => (
                <tr key={pracc.id} className="hover:bg-slate-950/40 transition-colors group">
                  <td className="py-3 text-muted-foreground">{pracc.date}</td>
                  <td className="py-3 font-bold text-foreground">{pracc.opponent}</td>
                  
                  {activeMap === "ALL" && (
                    <td className="py-3 text-center">
                      <span className="bg-slate-900 border border-border/60 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase">
                        {pracc.map}
                      </span>
                    </td>
                  )}

                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                      {pracc.sideStart === "ATK" ? (
                        <>
                          <Swords className="h-3 w-3 text-amber-400" />
                          <span className="text-amber-400">ATK</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3 text-cyan-400" />
                          <span className="text-cyan-400">DEF</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border",
                        pracc.result === "WIN"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-primary/10 border-primary/30 text-primary"
                      )}
                    >
                      {pracc.result === "WIN" ? "WIN" : "LOSS"} ({pracc.scoreFlk}-{pracc.scoreEnemy})
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <button className="text-muted-foreground/40 hover:text-primary transition-colors inline-flex items-center gap-1 text-[10px] font-bold">
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}