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
    <div className="w-full max-w-xl bg-card rounded-card border border-border-light p-6 flex items-center gap-5">
      <div className="w-18 h-18 bg-tag-bg rounded-sm flex items-center justify-center text-5xl flex-shrink-0">
        {profile.avatar_emoji}
      </div>
      
      <div className="flex-1 min-w-0">
        {editingName ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              saveField('name', name)
              setEditingName(false)
            }}
            autoFocus
            className="w-full text-xl font-bold text-text bg-transparent border-b border-accent focus:outline-none"
          />
        ) : (
          <h1
            onClick={() => setEditingName(true)}
            className="text-xl font-bold text-text cursor-pointer hover:text-accent transition"
          >
            {name || 'Your name'}
          </h1>
        )}

        {editingTagline ? (
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            onBlur={() => {
              saveField('tagline', tagline)
              setEditingTagline(false)
            }}
            autoFocus
            className="w-full text-sm text-muted bg-transparent border-b border-accent focus:outline-none"
          />
        ) : (
          <p
            onClick={() => setEditingTagline(true)}
            className="text-sm text-muted cursor-pointer hover:text-text transition line-clamp-2"
          >
            {tagline || 'Add a tagline'}
          </p>
        )}
      </div>
    </div>
  )
}
