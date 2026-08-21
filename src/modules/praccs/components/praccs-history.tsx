"use client"

import React from "react"
import {getMapBackground} from "@/config/valorant-assets"

interface MatchItem {
    id: string
    map: string
    scoreUs: number
    scoreEnemy: number
    date: string
    active: boolean
}

interface PraccsListProps {
    praccsHistory: MatchItem[]
    lastMatch: any
    setSelectedMatch: (match: any) => void
    onMatchSelectChange?: (isMatchSelected: boolean, matchMapName: string | null) => void
}

export function PraccsList({
    praccsHistory,
    lastMatch,
    setSelectedMatch,
    onMatchSelectChange,
}: PraccsListProps) {


return (
    <div className="space-y-4 animate-fade-in">
      {/* Encabezado tradicional del listado */}
        <div className="flex flex-col gap-1.5 border-b border-border/40 pb-4">
            <h2 className="text-xl font-black tracking-tight uppercase font-mono text-primary flex items-center gap-2">
            🦅 Lista de praccs
            </h2>
            <p className="text-xs text-muted-foreground">
            Selecciona un mapa del registro analizado por la API para desglosar rondas, economías y sincronizar la VOD.
            </p>
    </div>

        {/* Grid de tarjetas tácticas */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {praccsHistory.map((match) => {
            const bgUrl = getMapBackground(match.map)
            return (
            <div
                key={match.id}
                onClick={() => {
                setSelectedMatch(match.id === "1" ? lastMatch : match)
                if (onMatchSelectChange) onMatchSelectChange(true, match.map)
                }}
                className="group relative h-40 rounded-xl overflow-hidden border border-border/60 bg-slate-950 shadow-md cursor-pointer hover:border-primary/50 transition-all scale-100 hover:scale-[1.02]"
            >
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                <img
                    src={bgUrl}
                    alt={match.map}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                />
                </div>
                <div className="absolute inset-0 bg-liner-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-20 font-mono">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-background/80 border border-border px-2 py-0.5 rounded font-bold text-muted-foreground tracking-wider uppercase">
                    {match.date}
                    </span>
                    {match.active && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
                <div>
                    <h4 className="text-lg font-black tracking-tighter text-foreground uppercase">{match.map}</h4>
                    <p className="text-2xl font-black text-primary tracking-tight mt-0.5">
                    {match.scoreUs} <span className="text-muted-foreground text-sm font-medium">vs</span> {match.scoreEnemy}
                    </p>
                </div>
                </div>
            </div>
            )
        })}
        </div>
    </div>
    )
}