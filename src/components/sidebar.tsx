"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Wallet, Map, Menu, X, Video, BarChart4 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { id: "overview", href: "/dashboard", label: "Vista General", icon: LayoutDashboard },
    { id: "praccs", href: "/dashboard/praccs", label: "Praccs", icon: Video },
    { id: "team-stats", href: "/dashboard/maps", label: "Análisis Mapas", icon: BarChart4 },
    { id: "players", href: "/dashboard/players", label: "Jugadores", icon: Users },
    { id: "economy", href: "/dashboard/economy", label: "Economía Global", icon: Wallet },
    { id: "tactics", href: "/dashboard/tactics", label: "Pizarra Táctica", icon: Map },
]

export function Sidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
    <>
        <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-50 rounded-md border border-border bg-card p-2 text-foreground md:hidden">
        <Menu className="h-5 w-5" />
        </button>

        {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}

        <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-3">
        {/* Imagen corregida con src y tamaño */}
        <img src="/icon.svg" alt="Vantage Logo" className="w-9 h-9 drop-shadow-md" />
        <div>
        {/* Texto con la marca aplicada (Itálica y bicolor) */}
        <p className="text-sm font-black tracking-wide text-sidebar-foreground uppercase italic">VAN<span className="text-primary">TAGE</span></p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Esports Management</p>
        </div>
    </div>
    <button onClick={() => setOpen(false)} className="text-sidebar-foreground md:hidden hover:text-primary transition-colors">
        <X className="h-5 w-5" />
    </button>
    </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
            const Icon = item.icon
            // Si la URL coincide con el href del item, lo marcamos como activo
            const isActive = pathname === item.href
            return (
                <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground")}>
                <span className={cn("flex h-5 w-1 rounded-full", isActive ? "bg-primary" : "bg-transparent")} />
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                </Link>
            )
            })}
        </nav>
        </aside>
    </>
    )
}