"use client"

import React from "react"
import { Map, CalendarDays, CheckCircle2, Clock, Swords, GraduationCap, Video } from "lucide-react"

export function DashboardOverview() {
  // Métricas para la presentación ante el Club de Fútbol
  const quickStats = [
    { 
      title: "Mejor Mapa Jugado", 
      value: "Pearl", 
      desc: "84% Winrate (16 Partidos)", 
      icon: Map, 
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
    },
    { 
      title: "Últimas Praccs", 
      value: "Bind / Ascent", 
      desc: "Balance: +2 Victorias ayer", 
      icon: Swords, 
      color: "text-primary bg-primary/10 border-primary/20" 
    },
    { 
      title: "Tareas Pendientes", 
      value: "3 Objetivos", 
      desc: "Prioridad: Alta para el Roster", 
      icon: CheckCircle2, 
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20" 
    },
  ]

  const scheduleTasks = [
    { 
      time: "16:00 - 17:30", 
      type: "Teórica / Táctica", 
      title: "Análisis de Líneas de Visión en Abyss", 
      desc: "Estudio de setups defensivos del meta actual y contra-estrategias.", 
      icon: GraduationCap, 
      badge: "Estrategia", 
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20" 
    },
    { 
      time: "17:45 - 21:00", 
      type: "Bloque Scrims", 
      title: "Bloque de 3 mapas vs KOI / Movistar Optix", 
      desc: "Sincronización de VOD en tiempo real y testeo de composiciones con Vyse.", 
      icon: Swords, 
      badge: "Pracc Oficial", 
      badgeColor: "bg-primary/10 text-primary border-primary/20" 
    },
    { 
      time: "21:15 - 22:30", 
      type: "Post-Review", 
      title: "Revisión de Errores Económicos y VOD", 
      desc: "Cruzar datos del Economy Chart para pulir compras forzadas y rondas eco.", 
      icon: Video, 
      badge: "Análisis", 
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" 
    },
  ]

  return (
    <div className="space-y-6 w-full animate-fade-in font-mono">
      
      {/* 📊 SECCIÓN DE INFO METRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border bg-slate-950/40 backdrop-blur-md flex items-center justify-between transition-all hover:scale-[1.01] ${stat.color}`}>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">{stat.title}</span>
              <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{stat.value}</h4>
              <p className="text-[11px] font-sans text-muted-foreground">{stat.desc}</p>
            </div>
            <stat.icon className="h-8 w-8 opacity-70 shrink-0" />
          </div>
        ))}
      </div>

      {/* 📅 CALENDARIO DIARIO DE ENTRENAMIENTOS */}
      <div className="rounded-xl border border-border/60 bg-slate-950/80 p-5 shadow-xl space-y-4">
        <div className="flex flex-col gap-1 border-b border-border/30 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
            <CalendarDays className="h-4 w-4" /> Planificación de Entrenamientos & Tareas
          </div>
          <p className="text-[11px] font-sans text-muted-foreground">
            Cronograma diario automatizado para el Staff Técnico y Jugadores del Club.
          </p>
        </div>

        {/* Timeline del Calendario */}
        <div className="relative border-l-2 border-border/40 ml-3 pl-6 space-y-6 py-2">
          {scheduleTasks.map((task, idx) => (
            <div key={idx} className="relative group">
              
              {/* Nodo indicador en la línea de tiempo */}
              <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary shadow-[0_0_8px_rgba(239,68,68,0.3)]" />

              {/* Tarjeta de Tarea */}
              <div className="p-4 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-border/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-border/60 text-muted-foreground shrink-0 mt-0.5">
                    <task.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {task.time}
                      </span>
                      <span className="text-muted-foreground/40 text-[10px]">•</span>
                      <span className="text-xs font-black text-foreground uppercase tracking-tight">{task.type}</span>
                    </div>
                    <h5 className="text-sm font-bold text-foreground/90 font-sans">{task.title}</h5>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">{task.desc}</p>
                  </div>
                </div>

                {/* Etiqueta de Categoría */}
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border tracking-wider self-start md:self-center shrink-0 ${task.badgeColor}`}>
                  {task.badge}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}