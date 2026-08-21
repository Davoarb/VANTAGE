import { cn } from "@/lib/utils"

interface MapEconomyChartProps {
  currentStats: any
  activeMap: string
}

export function MapEconomyChart({ currentStats, activeMap }: MapEconomyChartProps) {
  const econItems = [
    { label: "Pistol Round", data: currentStats.economy.pistol, color: "bg-cyan-500" },
    { label: "Eco Round", data: currentStats.economy.eco, color: "bg-emerald-500" },
    { label: "Bonus (R3 / R14)", data: currentStats.economy.bonus, color: "bg-purple-500" },
    { label: "Semi Buy", data: currentStats.economy.semiBuy, color: "bg-amber-500" },
    { label: "Full Buy", data: currentStats.economy.fullBuy, color: "bg-primary" }
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 w-full">
      <div className="text-cyan-400 font-black text-[10px] uppercase tracking-wider border-b border-border pb-2">
        RENDIMIENTO Y WIN RATE POR ECONOMÍA (ROUND DISTRIBUTION) - {activeMap === "ALL" ? "POOL GLOBAL" : activeMap.toUpperCase()}
      </div>
      <div className="space-y-4 font-sans">
        {econItems.map((item, idx) => {
          const winWidth = item.data.total > 0 ? (item.data.won / item.data.total) * 100 : 0
          const lossWidth = item.data.total > 0 ? (item.data.lost / item.data.total) * 100 : 0
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider font-mono">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.data.pct}% WR</span>
              </div>
              <div className="w-full h-7 bg-slate-950/60 rounded-lg overflow-hidden border border-border/30 flex relative">
                <div style={{ width: `${winWidth}%` }} className={cn("h-full flex items-center px-3 text-[9px] font-black text-black", item.color)} />
                <div style={{ width: `${lossWidth}%` }} className="h-full bg-primary/10 border-l border-primary/20 backdrop-blur-[2px]" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}