'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function HeroCard({ profile, onUpdate }: { profile: Profile; onUpdate: (field: string, value: string) => void }) {
  const supabase = createClient()
  const [editingName, setEditingName] = useState(false)
  const [editingTagline, setEditingTagline] = useState(false)
  const [name, setName] = useState(profile.name || '')
  const [tagline, setTagline] = useState(profile.tagline || '')

  const saveField = async (field: string, value: string) => {
    const { error } = await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id)
    if (!error) {
      onUpdate(field, value)
    }
  }

  return (
    <div className="bg-card rounded-card border border-border p-12 text-center space-y-4">
      <div className="text-5xl mb-4">{profile.avatar_emoji}</div>
      
      {editingName ? (
        <textarea
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            saveField('name', name)
            setEditingName(false)
          }}
          autoFocus
          className="w-full text-3xl font-bold text-text bg-subtle-bg border border-border rounded-btn p-3 focus:outline-none focus:border-accent"
        />
      ) : (
        <h1
          onClick={() => setEditingName(true)}
          className="text-3xl font-bold text-text cursor-pointer hover:text-accent transition"
        >
          {name || 'Your name'}
        </h1>
      )}

      {editingTagline ? (
        <textarea
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          onBlur={() => {
            saveField('tagline', tagline)
            setEditingTagline(false)
          }}
          autoFocus
          className="w-full text-muted bg-subtle-bg border border-border rounded-btn p-3 focus:outline-none focus:border-accent"
        />
      ) : (
        <p
          onClick={() => setEditingTagline(true)}
          className="text-muted cursor-pointer hover:text-text transition"
        >
          {tagline || 'Add a tagline'}
        </p>
      )}
    </div>
  )
}
