"use client"

import { useMemo, useState } from "react"
import { TrendingUp, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface EconomyChartProps {
  rawTimelineData: any
}

export function EconomyChart({ rawTimelineData }: EconomyChartProps) {
  const [activeTab, setActiveTab] = useState<"total" | "bank" | "loadout">("total")

  // 📊 1. PARSEO DE DATOS CON HISTORIAL REAL O SIMULADO (17 RONDAS)
  const chartData = useMemo(() => {
    const rondasDetails = rawTimelineData?.detallesPorRondaCompleta || []

    if (rondasDetails.length === 0) {
      const mockDeltas = [0, 10000, 3000, 31000, 26000, 7000, -500, -11000, 21000, 31000, 25000, 24000, 0, 5000, 10000, -4000, 12000]
      const falkeWins = [true, true, true, true, false, false, false, true, true, true, true, true, true, true, false, true, true]
      const rVias = ["kills", "kills", "kills", "kills", "kills", "defuse", "kills", "kills", "kills", "kills", "kills", "kills", "defuse", "kills", "kills", "kills", "kills"]

      return Array.from({ length: 17 }, (_, i) => {
        const r = i + 1
        const diff = mockDeltas[i]
        return {
          ronda: r,
          diff: diff,
          falkeGano: falkeWins[i],
          via: rVias[i],
          esPistolas: r === 1 || r === 13,
          falkeType: diff > 15000 ? "FULL" : diff >= 0 ? "SEMI" : "ECO",
          rivalType: diff < -15000 ? "FULL" : diff <= 0 ? "SEMI" : "ECO"
        }
      })
    }

    return rondasDetails.map((r: any) => {
      const falkeSpent = r.gastoTotalFalke || r.falkeSpent || 0
      const rivalSpent = r.gastoTotalRival || r.rivalSpent || 0
      const falkeGanoRonda = r.resultado === "🏆 GANADA" || r.falkeWin === true

      return {
        ronda: r.ronda,
        diff: falkeSpent - rivalSpent,
        falkeGano: falkeGanoRonda,
        via: r.via || "kills",
        esPistolas: r.ronda === 1 || r.ronda === 13,
        falkeType: falkeSpent <= 4500 ? "ECO" : falkeSpent <= 14500 ? "SEMI" : "FULL",
        rivalType: rivalSpent <= 4500 ? "ECO" : rivalSpent <= 14500 ? "SEMI" : "FULL"
      }
    })
  }, [rawTimelineData])

  // 📐 2. COMPONEDOR GEOMÉTRICO CON DIVISIONES EN VERDE Y ROJO
  const { coords, areaFalkePoints, areaRivalPoints, gridLines, centerY } = useMemo(() => {
    const width = 1000
    const height = 180
    const paddingLeft = 50
    const paddingRight = 30
    const paddingTop = 20
    const paddingBottom = 20

    const totalRounds = chartData.length
    const chartWidth = width - paddingLeft - paddingRight
    const chartHeight = height - paddingTop - paddingBottom
    const cY = paddingTop + chartHeight / 2

    const maxVal = 35000

    const linesCoords = chartData.map((d: any, i: number) => {
      const x = paddingLeft + (i / (totalRounds - 1)) * chartWidth
      const y = cY - (d.diff / maxVal) * (chartHeight / 2)
      return { x, y, diff: d.diff }
    })

    // Construcción de polígonos de relleno divididos con base en la línea neutral ($0)
    let falkePath = `${linesCoords[0].x},${cY} `
    linesCoords.forEach((c: any) => {
      falkePath += `${c.x},${c.y > cY ? cY : c.y} `
    })
    falkePath += `${linesCoords[linesCoords.length - 1].x},${cY}`

    let rivalPath = `${linesCoords[0].x},${cY} `
    linesCoords.forEach((c: any) => {
      rivalPath += `${c.x},${c.y < cY ? cY : c.y} `
    })
    rivalPath += `${linesCoords[linesCoords.length - 1].x},${cY}`

    const lines = [-25000, -15000, -5000, 0, 5000, 15000, 25000].map(val => ({
      y: cY - (val / maxVal) * (chartHeight / 2),
      label: val === 0 ? "0" : `${val > 0 ? "+" : ""}${Math.abs(val / 1000)}k`
    }))

    return { coords: linesCoords, areaFalkePoints: falkePath, areaRivalPoints: rivalPath, gridLines: lines, centerY: cY }
  }, [chartData])

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xl space-y-6 font-mono text-xs">
      {/* HEADER DE CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-4 gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> ECONOMY DASHBOARD TRACKER
          </h3>
          <div className="flex items-center gap-6 mt-1 text-[11px] text-muted-foreground font-sans">
            <span>Avg. Bank: <strong className="text-emerald-400 font-mono">$12.221</strong> / <span className="text-red-400 font-mono">$4.438</span></span>
            <span>Avg. Loadout: <strong className="text-emerald-400 font-mono">$18.453</strong> / <span className="text-red-400 font-mono">$15.565</span></span>
          </div>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1 text-[11px]">
          {(["bank", "loadout", "total"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded px-3 py-1 font-medium capitalize transition-all",
                activeTab === tab ? "bg-background text-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 EL SVG REFACTORIZADO CON COLORES INLINE BLINDADOS */}
      <div className="relative bg-slate-950/60 border border-border/40 rounded-2xl p-4 overflow-hidden shadow-inner">
        <svg viewBox="0 0 1000 180" className="w-full h-auto overflow-visible select-none">
          {/* Rejilla horizontal de fondo con números en blanco puro inline */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1="45"
                y1={line.y}
                x2="980"
                y2={line.y}
                stroke="#475569"
                strokeWidth={line.label === "0" ? "2" : "1"}
                strokeDasharray={line.label === "0" ? "0" : "4 4"}
                opacity={0.2} // Forzado inline también para la línea
              />
              {/* 🚀 Atributos SVG inline nativos: fill="#ffffff" y font-weight para obligar al blanco brillante */}
              <text
                x="15"
                y={line.y + 4}
                fill="#ffffff"
                fontSize="10px"
                fontWeight="900"
                fontFamily="monospace"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* 🟢 ÁREA SUPERIOR: Relleno traslúcido verde para FALKE */}
          <polygon points={areaFalkePoints} fill="#10b981" fillOpacity="0.12" />
          {/* 🔴 ÁREA INFERIOR: Relleno traslúcido rojo para el RIVAL */}
          <polygon points={areaRivalPoints} fill="#ef4444" fillOpacity="0.12" />

          {/* 柱 COLUMNAS VERTICALES DE CONTRASTE (Barras de fondo) */}
          {coords.map((c: any, i: number) => {
            const isFalkeDominant = c.diff >= 0
            return (
              <line
                key={i}
                x1={c.x}
                y1={centerY}
                x2={c.x}
                y2={c.y}
                stroke={isFalkeDominant ? "#10b981" : "#ef4444"}
                strokeWidth="2.5"
                opacity="0.4"
              />
            )
          })}

          {/* 📈 LÍNEA CONTINUA QUE CAMBIA DE COLOR SEGÚN EL BANDO DOMINANTE */}
          {coords.map((c: any, i: number) => {
            if (i === 0) return null
            const prev = coords[i - 1]
            const isFalkeSegment = c.diff >= 0

            return (
              <line
                key={i}
                x1={prev.x}
                y1={prev.y}
                x2={c.x}
                y2={c.y}
                stroke={isFalkeSegment ? "#34d399" : "#f87171"}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )
          })}

          {/* Nodos circulares interactivos */}
          {coords.map((c: any, i: number) => {
            const isFalkeDominant = c.diff >= 0
            return (
              <g key={i} className="group/node cursor-pointer">
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="3.5"
                  fill={isFalkeDominant ? "#34d399" : "#f87171"}
                  stroke="#020617"
                  strokeWidth="2"
                  className="transition-all duration-150 group-hover/node:r-5.5"
                />
                <title>{`Ronda ${chartData[i].ronda}\nVentaja: ${isFalkeDominant ? "Falke" : "Rival"}\nDelta: ${Math.abs(c.diff)}$`}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* FILA DE ICONOS DE FINAL DE RONDA (✕ / Shield) */}
      <div className="overflow-x-auto pb-2 border-t border-border/30 pt-4">
        <div className="flex items-center gap-2 min-w-[800px] justify-between px-10">
          {chartData.map((data: any) => {
            const isDefuse = data.via?.toLowerCase().includes("defuse") || data.via?.includes("✂️")
            return (
              <div key={data.ronda} className="flex flex-col items-center gap-2 flex-1 relative">
                {data.esPistolas && (
                  <span className="absolute -top-5 text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded scale-90">PIST</span>
                )}
                <span className="text-[10px] font-bold text-muted-foreground/60">{data.ronda}</span>

                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center border-2 shadow-md font-black text-xs transition-all",
                  data.falkeGanó
                    ? "bg-emerald-950/40 border-emerald-500/80 text-emerald-400"
                    : "bg-red-950/40 border-red-500/80 text-red-400"
                )}>
                  {isDefuse ? <Shield className="h-3 w-3" /> : <span className="text-[10px]">✕</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}