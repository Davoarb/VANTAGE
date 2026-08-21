"use client"
import { Upload } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="pl-12 md:pl-0">
      </div>

      <button type="button" className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90">
        <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        Subir Pracc (.json)
      </button>
    </header>
  )
}