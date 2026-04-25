'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactLink } from '@/types'

export default function ContactSection({ profileId, links: initialLinks }: { profileId: string; links: ContactLink[] }) {
  const supabase = createClient()
  const [links, setLinks] = useState(initialLinks)
  const [email, setEmail] = useState(initialLinks.find((l) => l.type === 'email')?.url || '')
  const [emailInput, setEmailInput] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(!email)
  const socialTypes = ['linkedin', 'dribbble', 'behance']

  const handleSaveEmail = async () => {
    if (!emailInput) return

    const existing = links.find((l) => l.type === 'email')
    if (existing) {
      await supabase.from('contact_links').update({ url: emailInput }).eq('id', existing.id)
      setLinks(links.map((l) => (l.id === existing.id ? { ...l, url: emailInput } : l)))
    } else {
      const { data, error } = await supabase
        .from('contact_links')
        .insert({ profile_id: profileId, type: 'email', label: 'Email', url: emailInput, position: 0 })
        .select()
        .single()
      if (!error && data) setLinks([...links, data])
    }

    setEmail(emailInput)
    setEmailInput('')
    setShowEmailForm(false)
  }

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email)
      alert('Email copied!')
    }
  }

  const handleDeleteLink = async (id: string) => {
    await supabase.from('contact_links').delete().eq('id', id)
    setLinks(links.filter((l) => l.id !== id))
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Contact</h2>

      <div className="space-y-4">
        {/* Email */}
        {showEmailForm ? (
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
            onBlur={() => emailInput && handleSaveEmail()}
            autoFocus
          />
        ) : (
          <button
            onClick={email ? handleCopyEmail : () => setShowEmailForm(true)}
            className="w-full text-left px-4 py-3 bg-card border border-border rounded-btn hover:border-accent transition"
          >
            <div className="font-semibold text-text">✉️ {email ? 'Copy email' : 'Add email'}</div>
            {email && <div className="text-sm text-muted">{email}</div>}
          </button>
        )}

        {/* Social links */}
        {socialTypes.map((type) => {
          const link = links.find((l) => l.type === type)
          return (
            <button
              key={type}
              className="w-full text-left px-4 py-3 bg-card border border-border rounded-btn hover:border-accent transition"
            >
              <div className="font-semibold text-text capitalize">{type}</div>
              {link && (
                <>
                  <div className="text-sm text-muted truncate">{link.url}</div>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-xs text-accent hover:underline mt-1"
                  >
                    Remove
                  </button>
                </>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
