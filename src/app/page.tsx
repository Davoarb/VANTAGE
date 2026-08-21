import { loginWithEmail, signInAsGuest } from './actions/auth'
import { BackgroundAura } from '@/components/ui/background-aura'
import { BorderBeam } from "@/components/ui/border-beam"

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LandingPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <BackgroundAura />

      <div className="relative w-full max-w-md z-10">
        {/* Logo / Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-8xl font-black italic tracking-tighter text-foreground uppercase leading-none">
            VAN<span className="text-primary">TAGE</span>
          </h1>
          <p className="text-muted-foreground text-xs font-bold tracking-[0.3em] uppercase opacity-80">
            The Ultimate Esports Management Platform
          </p>
        </div>

        {/* Login Card con Border Beam */}
        <div className="relative bg-card/40 border border-border p-8 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Formulario Email/Password */}
          <form action={loginWithEmail} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">
                Staff Access
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="EMAIL"
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-1">
              <input
                name="password"
                type="password"
                required
                placeholder="PASSWORD"
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <p className="text-destructive text-[11px] font-bold uppercase text-center animate-pulse tracking-tighter">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-black py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] uppercase text-sm tracking-tighter shadow-lg shadow-primary/20"
            >
              Login Staff
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-3 text-muted-foreground font-bold tracking-widest">
                O continuar como
              </span>
            </div>
          </div>

          {/* Formulario Invitado */}
          <form action={signInAsGuest} className="relative z-10">
            <button
              type="submit"
              className="w-full bg-background/50 border border-border text-muted-foreground font-bold py-3 rounded-xl hover:bg-muted hover:text-foreground transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
            >
              Entrar como Invitado
            </button>
          </form>

          {/* Animación de Borde Blanco */}
          <BorderBeam
            duration={8}
            size={400}
            className="from-transparent via-white to-transparent"
          />
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Davopavo - Restricted Access
          </p>
        </footer>
      </div>
    </main>
  )
}