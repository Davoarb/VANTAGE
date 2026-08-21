import { cn } from "@/lib/utils"

interface MapSitesAnalysisProps {
  sitesData: any[]
  activeSide: "ALL" | "ATK" | "DEF"
}

export function MapSitesAnalysis({ sitesData, activeSide }: MapSitesAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      {sitesData.map((site, idx) => {
        const showAtk = activeSide === "ALL" || activeSide === "ATK"
        const showDef = activeSide === "ALL" || activeSide === "DEF"

        return (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-4">
            <div className={cn(
              "font-black text-[10px] uppercase tracking-wider border-b border-border pb-2 flex justify-between items-center",
              activeSide === "ATK" ? "text-amber-400" : activeSide === "DEF" ? "text-cyan-400" : "text-emerald-400"
            )}>
              <span>{site.name}</span>
              {showAtk && <span className="text-[9px] text-muted-foreground/60">Postplant: {site.postPlant}%</span>}
            </div>
            
            <div className="space-y-3 font-sans text-[11px]">
              {showAtk && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground font-mono">
                    <span>Win Rate ATK</span>
                    <span className="text-amber-400">{site.atkWin}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-border/20">
                    <div style={{ width: `${site.atkWin}%` }} className="h-full bg-amber-500 rounded-full" />
                  </div>
                </div>
              )}

              {showDef && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground font-mono">
                    <span>Win Rate DEF</span>
                    <span className="text-cyan-400">{site.defWin}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-border/20">
                    <div style={{ width: `${site.defWin}%` }} className="h-full bg-cyan-500 rounded-full" />
                  </div>
                </div>
              )}

              <div className="border-t border-border/20 my-2 pt-2" />

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
                {showAtk && (
                  <div className="bg-slate-950/40 border border-border/40 rounded-lg p-2 col-span-2 sm:col-span-1">
                    <p className="text-muted-foreground text-[8px] uppercase font-bold">FK en ATK</p>
                    <p className="text-amber-400 font-black text-xs mt-0.5">{site.atkFk}%</p>
                  </div>
                )}
                {showDef && (
                  <div className="bg-slate-950/40 border border-border/40 rounded-lg p-2 col-span-2 sm:col-span-1">
                    <p className="text-muted-foreground text-[8px] uppercase font-bold">FK en DEF</p>
                    <p className="text-cyan-400 font-black text-xs mt-0.5">{site.defFk}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}