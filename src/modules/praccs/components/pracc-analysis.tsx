"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Calendar, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
// 🚀 Importamos getMapBackground de forma limpia
import { getMapBackground } from "@/config/valorant-assets"

// 🔌 Importación de los bloques tácticos locales
import { ScoreboardTable } from "./scoreboard-table"
import { TimelineRounds } from "./timeline-rounds"
import { EconomyAnalysis } from "./economy-analysis"
import MapPositions from "./map-positions"
import { EconomyChart } from "./economy-chart"
import { TypeRound } from "./type-round"
import { HeatmapPositions } from "./heatmap-positions"

// 🧼 Limpiamos la interfaz removiendo mapBackgrounds
interface PraccAnalysisProps {
    currentActiveMatch: any
    onBack: () => void
    onMatchSelectChange?: (isMatchSelected: boolean, matchMapName: string | null) => void
}

// 🧼 Limpiamos los parámetros de la función removiendo mapBackgrounds
export function PraccAnalysis({
    currentActiveMatch,
    onBack,
    onMatchSelectChange
}: PraccAnalysisProps) {
    const [activeRoundNumber, setActiveRoundNumber] = useState<number>(1)
    const [youtubeVideoId, setYoutubeVideoId] = useState("dQw4w9WgXcQ")
    const playerRef = useRef<any>(null)
    const containerId = "youtube-player-container"

    const extractYoutubeId = (urlOrId: string) => {
        if (!urlOrId) return "dQw4w9WgXcQ"
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = urlOrId.match(regExp)
        return (match && match[2].length === 11) ? match[2] : urlOrId
    }

    const initYouTubePlayer = () => {
        if (playerRef.current) {
            if (typeof playerRef.current.loadVideoById === "function") {
                playerRef.current.loadVideoById(youtubeVideoId)
            }
            return
        }
        if ((window as any).YT && (window as any).YT.Player) {
            playerRef.current = new (window as any).YT.Player(containerId, {
                height: "100%",
                width: "100%",
                videoId: youtubeVideoId,
                playerVars: { playsinline: 1, rel: 0, modestbranding: 1 }
            })
        }
    }

    useEffect(() => {
        const initialVod = currentActiveMatch?.rawTimeline?.vodUrl || "YOEZud6W2ZE"
        setYoutubeVideoId(extractYoutubeId(initialVod))
    }, [currentActiveMatch])

    useEffect(() => {
        if (youtubeVideoId) {
            if ((window as any).YT && (window as any).YT.Player) {
                initYouTubePlayer()
            } else {
                const tag = document.createElement("script")
                tag.src = "https://www.youtube.com/iframe_api"
                const firstScriptTag = document.getElementsByTagName("script")[0]
                if (firstScriptTag && firstScriptTag.parentNode) {
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
                }
                ; (window as any).onYouTubePlayerAPIReady = () => { initYouTubePlayer() }
            }
        }
        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === "function") {
                playerRef.current.destroy()
                playerRef.current = null
            }
        }
    }, [youtubeVideoId])

    const jumpToVideoTime = (seconds: number) => {
        if (playerRef.current && typeof playerRef.current.seekTo === "function") {
            playerRef.current.seekTo(seconds, true)
            playerRef.current.playVideo()
        }
    }

    const handleRoundSelect = (roundNum: number) => {
        setActiveRoundNumber(roundNum)
        jumpToVideoTime((roundNum - 1) * 100)
    }

    const matchPlayersList = currentActiveMatch.players || currentActiveMatch.MatchPlayer || currentActiveMatch.matchPlayers || []
    const formattedMatchDate = currentActiveMatch.date
        ? new Date(currentActiveMatch.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
        : "15 de Junio, 2026"

    const wins = currentActiveMatch.scoreUs ?? 0
    const losses = currentActiveMatch.scoreEnemy ?? 0

    let statusColor = "border-amber-500/30 text-amber-400 bg-amber-500/5"
    let statusLabel = "DRAW"

    if (wins > losses) {
        statusColor = "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
        statusLabel = "VICTORIA"
    } else if (wins < losses) {
        statusColor = "border-red-500/30 text-red-400 bg-red-500/5"
        statusLabel = "DERROTA"
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/20 pb-2 font-mono">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground hover:text-primary transition-colors bg-muted/30 border border-border/40 px-3 py-1.5 rounded-lg"
                >
                    <ChevronLeft className="h-3.5 w-3.5" /> VOLVER AL LISTADO
                </button>
            </div>

            {/* HEADER HERO CON MARCADOR HUD INTEGRADO */}
            <div className="relative h-28 rounded-2xl overflow-hidden border border-border/60 shadow-lg bg-slate-950 group">
                <div className="absolute inset-0 z-0 opacity-75 transition-opacity duration-300 group-hover:opacity-85">
                    <img
                        src={getMapBackground(currentActiveMatch.map)}
                        alt="Map Background"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="absolute inset-0 bg-liner-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
                <div className="absolute inset-0 p-5 flex items-center justify-between z-20 font-mono">
                    <div className="space-y-1.5">
                        <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase drop-shadow-md">
                            {currentActiveMatch.rawTimeline?.teamRival ? `ANÁLISIS TÁCTICO · FALKE vs ${currentActiveMatch.rawTimeline.teamRival}` : `SCRIMS ANALYTICS · DESIGNATED TO ${currentActiveMatch.map || "PEARL"}`}
                        </h1>
                        <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-bold">
                            <span className="flex items-center gap-1.5 uppercase tracking-wide bg-slate-900/90 px-2 py-0.5 rounded-md border border-border/40 text-foreground/90"><Calendar className="h-3.5 w-3.5" /> {formattedMatchDate}</span>
                            <span className="flex items-center gap-1.5 uppercase tracking-wide bg-slate-900/90 px-2 py-0.5 rounded-md border border-border/40 text-primary"><MapPin className="h-3.5 w-3.5" /> AREA: {currentActiveMatch.map || "Pearl"}</span>
                        </div>
                    </div>

                    <div className={cn("flex items-center gap-4 border px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md text-xs font-bold bg-slate-950/80 border-opacity-40", statusColor)}>
                        <div className={cn("h-2 w-2 rounded-full animate-pulse shrink-0", wins > losses ? "bg-emerald-400" : wins < losses ? "bg-red-400" : "bg-amber-400")} />
                        <div className="flex items-center gap-1.5"><span className="text-foreground font-black text-sm">{wins}</span><span className="text-muted-foreground/60 text-[9px]">FALKE</span></div>
                        <div className="h-3 w-px bg-border/30" />
                        <div className="flex items-center gap-1.5"><span className="text-foreground font-black text-sm">{losses}</span><span className="text-muted-foreground/60 text-[9px]">RIVAL</span></div>
                        <div className="h-3 w-px bg-border/30" />
                        <span className="text-[9px] font-black tracking-widest uppercase bg-slate-900/85 px-2 py-0.5 rounded border border-border/40">{statusLabel}</span>
                    </div>
                </div>
            </div>

            {/* 📋 SECCIÓN DE COMPONENTES DECLARATIVOS */}
            <TimelineRounds scoreUs={wins} scoreEnemy={losses} rawTimelineData={currentActiveMatch.rawTimeline} currentRound={activeRoundNumber} onRoundSelect={handleRoundSelect} />

            {/* 🎥 REPRODUCTOR MULTIMEDIA */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xl space-y-4">
                <div className="w-full max-w-4xl mx-auto aspect-video bg-slate-950 rounded-xl overflow-hidden border border-border/80 shadow-2xl relative">
                    <div id={containerId} className="w-full h-full object-contain" />
                </div>
            </div>
            {/* =====================================================================
            📊 BLOQUE MIXTO: SNAPSHOT ECONÓMICO + RADAR INTERACTIVOS ALINEADOS
           ===================================================================== */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch w-full">

                {/* Caja Izquierda: Economía (Ocupa 5 columnas de 12) */}
                <div className="xl:col-span-5 h-full flex flex-col">
                    <EconomyAnalysis
                        rawTimelineData={currentActiveMatch.rawTimeline}
                        currentRound={activeRoundNumber}
                    />
                </div>

                {/* Caja Derecha: Radar + Bajas Integrados (Ocupa 7 columnas de 12) */}
                <div className="xl:col-span-7 h-full flex flex-col">
                    <MapPositions
                        mapName={currentActiveMatch.map || "Pearl"}
                        currentRound={activeRoundNumber}
                        rawTimelineData={currentActiveMatch.rawTimeline}
                        onEventClick={(seconds: number) => {
                            const roundStart = (activeRoundNumber - 1) * 100
                            jumpToVideoTime(roundStart + seconds)
                        }}
                    />
                </div>
            </div>

            {/* 📊 BLOQUE ANALÍTICO COMPLEMENTARIO (COMPLETAMENTE AISLADOS) */}
            <div className="pt-2 space-y-4">
                {/* 1. Módulo Independiente: Recuento de tipos de rondas */}
                <TypeRound rawTimelineData={currentActiveMatch.rawTimeline} />

                {/* 2. Módulo Independiente: Gráfico continuo de evolución económica */}
                <EconomyChart rawTimelineData={currentActiveMatch.rawTimeline} />
            </div>

            {/* Componente: Tabla de Estadísticas Generales */}
            <ScoreboardTable players={matchPlayersList} />

            {/* 📊 Mapa de Calor Acumulado a la derecha */}
            <div className="lg:col-span-5">
                {/* 🧼 NOTA: Aquí quitamos mapBackgrounds={mapBackgrounds} ya que no lo necesitamos */}
                <HeatmapPositions
                    mapName={currentActiveMatch.map || "Pearl"}
                />
            </div>
        </div>
    )
}