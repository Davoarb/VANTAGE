"use client"

import { cn } from "@/lib/utils"

interface TimelineRoundsProps {
  scoreUs: number
  scoreEnemy: number
  rawTimelineData?: any
  currentRound: number
  onRoundSelect: (roundNumber: number) => void
}

export function TimelineRounds({
  scoreUs,
  scoreEnemy,
  rawTimelineData,
  currentRound,
  onRoundSelect
}: TimelineRoundsProps) {

  const roundsArray = rawTimelineData?.timelineBotoneraSuperior || []
  const totalRounds = scoreUs + scoreEnemy
  const totalIterations = roundsArray.length > 0 ? roundsArray.length : totalRounds

  // Separación de rondas por mitades
  const firstHalfRounds = Array.from({ length: totalIterations }).map((_, i) => i + 1).filter(r => r <= 12)
  const secondHalfRounds = Array.from({ length: totalIterations }).map((_, i) => i + 1).filter(r => r > 12 && r <= 24)
  const overtimeRounds = Array.from({ length: totalIterations }).map((_, i) => i + 1).filter(r => r > 24)

  const getViaIcon = (viaText: string) => {
    if (!viaText) return "🎯"
    const textLower = viaText.toLowerCase()
    if (textLower.includes("defuse") || textLower.includes("✂️")) return "✂️"
    if (textLower.includes("spike") || textLower.includes("💥")) return "💥"
    if (textLower.includes("time") || textLower.includes("tiempo") || textLower.includes("⌛")) return "⌛"
    return "🎯"
  }

  const renderRoundButton = (roundNumber: number) => {
    const isActive = currentRound === roundNumber
    const index = roundNumber - 1

    let falkeGanaRonda = index < scoreUs
    let viaText = "🎯"

    if (roundsArray[index]) {
      falkeGanaRonda = roundsArray[index].resultado === "🏆 GANADA"
      viaText = roundsArray[index].via || "🎯"
    }

    return (
      <button
        key={roundNumber}
        type="button"
        onClick={() => {
          if (typeof onRoundSelect === "function") {
            onRoundSelect(roundNumber)
          }
        }}
        className={cn(
          "rounded-xl p-1.5 border flex flex-col items-center justify-between transition-all duration-150 font-mono shrink-0 select-none outline-none bg-slate-950/40 cursor-pointer",
          falkeGanaRonda
            ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40"
            : "border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40",
          isActive
            ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/25 text-amber-300 font-bold scale-105 shadow-md z-10"
            : ""
        )}
        // 📐 Boost de tamaño para albergar perfectamente el emoji/imagen sin saturar el layout
        style={{ width: "60px", height: "56px" }}
      >
        <span className="text-[9px] text-muted-foreground/50 font-sans font-bold block tracking-tight">R{roundNumber}</span>
        <span className="text-[13px] font-black tracking-tighter -my-1">{falkeGanaRonda ? "W" : "L"}</span>

        {/* Contenedor preparado para Emoji actual o futuras Imágenes / SVGs */}
        <div className="text-[13px] opacity-95 filter drop-shadow-sm flex items-center justify-center h-4 w-4">
          {getViaIcon(viaText)}
        </div>
      </button>
    )
  }

  return (
    <div className="w-full py-1">

      {/* 🟦 CONTENEDOR ENVOLVENTE MACRO CON SCROLL TÁCTICO INTEGRADO */}
      <div
        className="block w-full overflow-x-auto bg-slate-950/40 border border-border/30 rounded-2xl p-2 shadow-inner font-mono"
        style={{
          // 🎨 Personalización del scroll para navegadores modernos (Chrome, Edge, Safari)
          scrollbarWidth: "thin", // Para Firefox
          scrollbarColor: "rgba(71, 85, 105, 0.3) transparent", // Para Firefox
        }}
      >
        {/* Forzamos que el contenido interno de las mitades respire inline sin saltar de línea */}
        <div className="inline-flex items-center gap-5 min-w-max">

          {/* 📦 SUB-RECTÁNGULO 1: 1ST HALF */}
          {firstHalfRounds.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right pl-2 select-none shrink-0">
                <span className="text-[10px] text-cyan-400 font-black tracking-tighter uppercase leading-none">1st</span>
                <span className="text-[8px] text-muted-foreground/40 font-bold lowercase leading-none mt-0.5">half</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/60 border border-border/20 rounded-xl p-1.5 shadow-md">
                {firstHalfRounds.map(r => renderRoundButton(r))}
              </div>
            </div>
          )}

          {/* 📦 SUB-RECTÁNGULO 2: 2ND HALF */}
          {secondHalfRounds.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right select-none shrink-0">
                <span className="text-[10px] text-cyan-400 font-black tracking-tighter uppercase leading-none">2nd</span>
                <span className="text-[8px] text-muted-foreground/40 font-bold lowercase leading-none mt-0.5">half</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/60 border border-border/20 rounded-xl p-1.5 shadow-md">
                {secondHalfRounds.map(r => renderRoundButton(r))}
              </div>
            </div>
          )}

          {/* 📦 SUB-RECTÁNGULO 3: OVERTIME */}
          {overtimeRounds.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right select-none shrink-0">
                <span className="text-[10px] text-amber-400 font-black tracking-tighter uppercase leading-none">Over</span>
                <span className="text-[8px] text-muted-foreground/40 font-bold lowercase leading-none mt-0.5">time</span>
              </div>

              <div className="flex items-center gap-1 bg-amber-950/5 border border-amber-500/15 border-dashed rounded-xl p-1.5 shadow-md">
                {overtimeRounds.map(r => renderRoundButton(r))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 🛠️ INYECCIÓN DE ESTILOS GLOBALES DE SCROLL PARA WEBKIT */}
      <style jsx global>{`
        /* Estilizado global de la barra de scroll para este módulo */
        div::-webkit-scrollbar {
          height: 5px; /* La dejamos ultra fina */
        }
        div::-webkit-scrollbar-track {
          background: transparent; /* Fondo invisible para que no cante */
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.2); /* Color Slate grisáceo muy suave */
          border-radius: 9999px; /* Totalmente redondeada */
          transition: background 0.2s ease;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.4); /* Resalta sutilmente si pasan el ratón */
        }
      `}</style>

    </div>
  )
}