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
      .insert({ profile_id: profileId, role, company, date_range: dateRange, description, emoji, position: entries.length })
      .select().single()
    if (!error && data) {
      setEntries([...entries, data])
      setRole(''); setCompany(''); setDateRange(''); setDescription(''); setEmoji('🪜')
      setShowForm(false)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('career_entries').delete().eq('id', id)
    setEntries(entries.filter((e) => e.id !== id))
  }

  return (
    <section className="w-full max-w-[600px] space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[10px] font-bold text-placeholder uppercase tracking-[1.5px]">Career Ladder</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-xs font-semibold text-accent hover:underline">
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {showForm && (
          <div className="border-b border-border p-5 space-y-3">
            <div className="flex gap-2">
              <input type="text" maxLength={2} value={emoji} onChange={(e) => setEmoji(e.target.value)}
                className="w-12 h-12 text-center text-xl bg-subtle-bg border border-border rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role title"
                  className="w-full px-3 py-2 border border-border-light rounded-xl bg-card text-text text-sm focus:outline-none focus:border-accent" />
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company"
                  className="w-full px-3 py-2 border border-border-light rounded-xl bg-card text-text text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <input type="text" value={dateRange} onChange={(e) => setDateRange(e.target.value)} placeholder="e.g. Mar 2022 — Present"
              className="w-full px-3 py-2 border border-border-light rounded-xl bg-card text-text text-sm focus:outline-none focus:border-accent" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you do?"
              className="w-full px-3 py-2 border border-border-light rounded-xl bg-card text-text text-sm focus:outline-none focus:border-accent h-16 resize-none" />
            <button onClick={handleAddEntry} disabled={!role || !company || loading}
              className="w-full px-3 py-2.5 bg-text text-card rounded-xl font-semibold text-sm transition hover:opacity-80 disabled:opacity-40">
              Save entry
            </button>
          </div>
        )}

        {entries.length === 0 && !showForm ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-text mb-1">No career entries yet</p>
            <p className="text-xs text-muted">Add roles, companies and dates to showcase your journey.</p>
          </div>
        ) : (
          <div className="divide-y divide-tag-bg">
            {entries.map((e) => (
              <div key={e.id} className="flex gap-4 px-5 py-4">
                <span className="text-[28px] flex-shrink-0 leading-none mt-0.5">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-text">{e.role}{e.company ? ` @ ${e.company}` : ''}</span>
                    {e.date_range && (
                      <span className="text-xs font-medium text-muted bg-tag-bg px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        {e.date_range}
                      </span>
                    )}
                  </div>
                  {e.description && <p className="text-xs text-muted leading-relaxed">{e.description}</p>}
                </div>
                <button onClick={() => handleDelete(e.id)} className="text-placeholder hover:text-accent text-xs flex-shrink-0 mt-0.5">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
