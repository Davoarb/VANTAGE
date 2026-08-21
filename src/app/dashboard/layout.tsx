import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground antialiased selection:bg-primary/20">
      {/* Pintamos tu Sidebar recortado */}
        <Sidebar />

        <div className="flex flex-1 flex-col md:pl-64">

        {/* Pintamos tu Header recortado */}
        <Header title="Vantage" subtitle="Scrims" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
            {/* 💥 AQUÍ SE RENDERIZA LA PÁGINA SEGÚN LA URL 💥 */}
            {children}
            </div>
        </main>
        </div>
    </div>
    )
}