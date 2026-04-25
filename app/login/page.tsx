'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const handleGoogleSignIn = async () => {
    if (!supabase) return
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
  }

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !supabase) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (!error) {
      setMagicLinkSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white text-lg font-bold">✳</div>
          <div className="text-lg font-bold text-text tracking-tight">DFolio</div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-10 space-y-7 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text tracking-tight mb-1">Build your design portfolio</h1>
            <p className="text-sm text-muted leading-relaxed">Join designers who land roles with standout portfolios — set up in minutes.</p>
          </div>

          {magicLinkSent ? (
            <div className="bg-green-50 border border-green-300 rounded-2xl p-3 text-sm text-green-700 text-center">
              ✉️ Magic link sent to <strong>{email}</strong> — check your inbox!
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || !supabase}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-card border border-border-light rounded-2xl text-text font-semibold text-sm transition hover:bg-subtle-bg hover:border-muted disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted font-medium">or use magic link</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <form onSubmit={handleMagicLinkSignIn} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-border-light rounded-2xl bg-card text-text text-sm placeholder-muted focus:outline-none focus:border-accent transition"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !email || !supabase}
                  className="w-full px-4 py-3 bg-text text-card rounded-2xl font-semibold text-sm transition hover:bg-muted disabled:opacity-50"
                >
                  {loading ? 'Sending...' : '✦ Send magic link'}
                </button>
              </form>
            </>
          )}

          <p className="text-xs text-muted text-center leading-relaxed">
            By continuing you agree to our <a href="#" className="text-accent font-medium hover:underline">Terms</a> and <a href="#" className="text-accent font-medium hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
