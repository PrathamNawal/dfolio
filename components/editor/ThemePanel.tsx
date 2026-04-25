'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function ThemePanel({ profile, onUpdate }: { profile: Profile; onUpdate: (darkMode: boolean) => void }) {
  const supabase = createClient()
  const [darkMode, setDarkMode] = useState(profile.dark_mode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleToggleDarkMode = async () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    await supabase.from('profiles').update({ dark_mode: newValue }).eq('id', profile.id)
    onUpdate(newValue)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Theme</h2>

      <div className="bg-card rounded-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-text">Dark Mode</label>
          <button
            onClick={handleToggleDarkMode}
            className={`w-12 h-6 rounded-full transition ${darkMode ? 'bg-accent' : 'bg-border'}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-card border border-border p-6 space-y-4">
        <h3 className="font-semibold text-text">Templates</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Canvas', 'Mono', 'Gridline', 'Retro OS'].map((name) => (
            <button
              key={name}
              disabled={name !== 'Canvas'}
              className="px-4 py-3 bg-subtle-bg rounded-btn text-sm font-medium text-text hover:bg-border-light disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => name !== 'Canvas' && alert('Coming soon')}
            >
              {name} {name === 'Canvas' && '✓'}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
