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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Career</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-accent text-card rounded-btn font-semibold text-sm"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-card border border-border p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={2}
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-12 h-12 text-center text-xl bg-subtle-bg border border-border rounded-btn"
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g., Product Designer)"
                className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="Date range (e.g., 2020 – 2023)"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you do?"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent h-20"
          />
          <button
            onClick={handleAddEntry}
            disabled={!role || !company || loading}
            className="w-full px-4 py-3 bg-accent text-card rounded-btn font-semibold transition hover:bg-accent disabled:opacity-50"
          >
            Save Entry
          </button>
        </div>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-muted text-center py-8">No career entries yet</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="bg-card rounded-card border border-border p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{e.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-text">{e.role}</div>
                  <div className="text-sm text-muted">{e.company}</div>
                  {e.date_range && <div className="text-xs text-placeholder mt-1">{e.date_range}</div>}
                  {e.description && <p className="text-sm text-text mt-2">{e.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteEntry(e.id)}
                  className="text-accent hover:text-accent/80 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
