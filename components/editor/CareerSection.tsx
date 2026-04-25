'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CareerEntry } from '@/types'

export default function CareerSection({ profileId, entries: initialEntries }: { profileId: string; entries: CareerEntry[] }) {
  const supabase = createClient()
  const [entries, setEntries] = useState(initialEntries)
  const [showForm, setShowForm] = useState(false)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🪜')
  const [loading, setLoading] = useState(false)

  const handleAddEntry = async () => {
    if (!role || !company) return
    setLoading(true)

    const { data, error } = await supabase
      .from('career_entries')
      .insert({
        profile_id: profileId,
        role,
        company,
        date_range: dateRange,
        description,
        emoji,
        position: entries.length,
      })
      .select()
      .single()

    if (!error && data) {
      setEntries([...entries, data])
      setRole('')
      setCompany('')
      setDateRange('')
      setDescription('')
      setEmoji('🪜')
      setShowForm(false)
    }
    setLoading(false)
  }

  const handleDeleteEntry = async (id: string) => {
    await supabase.from('career_entries').delete().eq('id', id)
    setEntries(entries.filter((e) => e.id !== id))
  }

  return (
    <section className="w-full max-w-xl space-y-3">
      <div className="flex items-center justify-between px-5">
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Career</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-accent hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      <div className="bg-card rounded-card border border-border-light overflow-hidden">
        {showForm && (
          <div className="border-b border-border p-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={2}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-12 h-12 text-center text-xl bg-subtle-bg border border-border rounded-sm"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role"
                  className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                  className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Date range"
              className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent h-16"
            />
            <button
              onClick={handleAddEntry}
              disabled={!role || !company || loading}
              className="w-full px-3 py-2 bg-text text-card rounded-sm font-semibold text-sm transition hover:bg-muted disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}

        <div className="divide-y divide-tag-bg">
          {entries.length === 0 && !showForm ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted">No career entries yet</p>
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex gap-4 px-5 py-4">
                <span className="text-2xl flex-shrink-0">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-text text-sm">{e.role}</div>
                    {e.date_range && (
                      <div className="text-xs font-medium text-muted bg-tag-bg px-2.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                        {e.date_range}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted mb-1">{e.company}</div>
                  {e.description && <p className="text-xs text-muted leading-relaxed">{e.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteEntry(e.id)}
                  className="text-accent hover:text-accent/80 text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
