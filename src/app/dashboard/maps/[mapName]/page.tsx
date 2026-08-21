import { Header } from "@/components/header"
// Ajusta esta ruta dependiendo de dónde guardaste tu componente
import { TeamMapsDashboard } from "@/components/team-maps-dashboard" 

export default function AnalisisMapasPage() {
  return (
    <>
      <Header 
        title="Análisis de Mapas" 
        subtitle="Laboratorio táctico, tendencias macro y control de economía por mapa." 
      />
      
      {/* Contenedor principal que abraza tu Dashboard */}
      <div className="mx-auto max-w-[1600px] w-full pt-6 pb-12">
        <TeamMapsDashboard />
      </div>
    </>
  )
}