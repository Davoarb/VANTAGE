'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return redirect('/?error=Credenciales+inválidas')

  redirect('/dashboard')
}

export async function signInAsGuest() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInAnonymously()

  if (error) return redirect('/?error=Error+al+entrar+como+invitado')

  redirect('/dashboard')
}