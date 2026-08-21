"use client"

import { useState } from "react"
import { PraccsList } from "./components/praccs-history"
import { PraccAnalysis } from "./components/pracc-analysis"


interface PraccViewProps {
  lastMatch: any
  onMatchSelectChange?: (isMatchSelected: boolean, matchMapName: string | null) => void
}

export function PraccView({ lastMatch, onMatchSelectChange }: PraccViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(null)

  const praccsHistory = [
    { id: "1", map: lastMatch.map || "Pearl", scoreUs: lastMatch.scoreUs ?? 13, scoreEnemy: lastMatch.scoreEnemy ?? 4, date: "Hoy - Oficial", active: true },
    { id: "2", map: "Ascent", scoreUs: 11, scoreEnemy: 13, date: "Ayer - Scrim KPI", active: false },
    { id: "3", map: "Bind", scoreUs: 13, scoreEnemy: 10, date: "12 Jun - Scrim Case", active: false },
    { id: "4", map: "Haven", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
    { id: "5", map: "Fracture", scoreUs: 13, scoreEnemy: 2, date: "10 Jun - Oficial VRL", active: false },
  ]

  // Decidimos cuál es la pracc que está visualizando el usuario en caliente
  const currentActiveMatch = selectedMatch || lastMatch

  return (
    <div className="space-y-4">
      {!selectedMatch ? (
        // 🦅 VISTA 1: LISTADO COMPLETO DE HISTORIAL DE PRACCS
        <PraccsList
          praccsHistory={praccsHistory}
          lastMatch={lastMatch}
          setSelectedMatch={setSelectedMatch}
          onMatchSelectChange={onMatchSelectChange}
        />
      ) : (
        // 🏆 VISTA 2: CUADERNO INTERACTIVO TOTALMENTE AISLADO
        <PraccAnalysis
          currentActiveMatch={currentActiveMatch}
          onMatchSelectChange={onMatchSelectChange}
          onBack={() => {
            setSelectedMatch(null)
            if (onMatchSelectChange) onMatchSelectChange(false, null)
          }}
        />
      )}
    </div>
  )
}