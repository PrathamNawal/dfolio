'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactLink } from '@/types'

const SOCIALS = [
  { type: 'linkedin', label: 'LinkedIn' },
  { type: 'dribbble', label: 'Dribbble' },
  { type: 'behance', label: 'Behance' },
]

export default function ContactSection({ profileId, links: initialLinks }: { profileId: string; links: ContactLink[] }) {
  const supabase = createClient()
  const [links, setLinks] = useState(initialLinks)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [addingSocial, setAddingSocial] = useState<string | null>(null)
  const [socialInput, setSocialInput] = useState('')
  const [copied, setCopied] = useState(false)

  const emailLink = links.find((l) => l.type === 'email')

  const handleSaveEmail = async () => {
    if (!emailInput.includes('@')) return
    const existing = links.find((l) => l.type === 'email')
    if (existing) {
      await supabase.from('contact_links').update({ url: emailInput }).eq('id', existing.id)
      setLinks(links.map((l) => l.id === existing.id ? { ...l, url: emailInput } : l))
    } else {
      const { data } = await supabase.from('contact_links')
        .insert({ profile_id: profileId, type: 'email', label: 'Email', url: emailInput, position: 0 })
        .select().single()
      if (data) setLinks([...links, data])
    }
    setEmailInput('')
    setShowEmailForm(false)
  }

  const handleCopyEmail = () => {
    if (emailLink) {
      navigator.clipboard.writeText(emailLink.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveSocial = async (type: string, label: string) => {
    if (!socialInput) return
    const { data } = await supabase.from('contact_links')
      .insert({ profile_id: profileId, type, label, url: socialInput, position: links.length })
      .select().single()
    if (data) setLinks([...links, data])
    setSocialInput('')
    setAddingSocial(null)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('contact_links').delete().eq('id', id)
    setLinks(links.filter((l) => l.id !== id))
  }

  return (
    <section className="w-full max-w-[600px] space-y-3">
      <div className="px-1">
        <h2 className="text-[10px] font-bold text-placeholder uppercase tracking-[1.5px]">Contact</h2>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden px-5 py-4 space-y-2.5">
        {/* Email row */}
        {showEmailForm ? (
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEmail()}
              placeholder="your@email.com"
              autoFocus
              className="flex-1 px-4 py-2.5 border border-accent rounded-xl bg-card text-sm text-text focus:outline-none"
            />
            <button onClick={handleSaveEmail} className="px-4 py-2.5 bg-text text-card rounded-xl text-sm font-semibold">Save</button>
          </div>
        ) : (
          <button
            onClick={emailLink ? handleCopyEmail : () => setShowEmailForm(true)}
            className="w-full flex items-center justify-between border border-border-light rounded-xl px-4 py-3 hover:border-accent transition group"
          >
            <span className="text-sm text-muted group-hover:text-text transition">
              {copied ? '✓ Copied!' : emailLink ? 'Copy mail' : '+ Add email'}
            </span>
            <span className="text-placeholder text-base">@</span>
          </button>
        )}

        {/* Social links */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {SOCIALS.map(({ type, label }) => {
            const link = links.find((l) => l.type === type)
            if (addingSocial === type) return (
              <div key={type} className="flex gap-1.5 w-full">
                <input
                  value={socialInput}
                  onChange={(e) => setSocialInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveSocial(type, label)}
                  placeholder={`${label} URL`}
                  autoFocus
                  className="flex-1 px-3 py-2 border border-accent rounded-xl text-sm text-text bg-card focus:outline-none"
                />
                <button onClick={() => handleSaveSocial(type, label)} className="px-3 py-2 bg-text text-card rounded-xl text-sm font-semibold">Save</button>
                <button onClick={() => setAddingSocial(null)} className="px-3 py-2 text-muted text-sm">✕</button>
              </div>
            )
            return (
              <button
                key={type}
                onClick={() => link ? handleDelete(link.id) : setAddingSocial(type)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition border ${
                  link ? 'border-accent text-accent bg-orange-50' : 'border-border-light text-text hover:border-accent'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  {link
                    ? <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    : <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
                </svg>
                {label}
              </button>
            )
          })}

          {/* + Add button */}
          <button className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-placeholder border border-dashed border-border-light hover:border-accent hover:text-accent transition">
            + Add
          </button>
        </div>
      </div>
    </section>
  )
}
