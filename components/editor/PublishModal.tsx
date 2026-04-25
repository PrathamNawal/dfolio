'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function PublishModal({ profile, onClose, onPublished }: { profile: Profile; onClose: () => void; onPublished: (url: string) => void }) {
  const supabase = createClient()
  const [slug, setSlug] = useState(profile.slug || generateSlug(profile.name || ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  const handlePublish = async () => {
    if (!slug) {
      setError('Please enter a slug')
      return
    }

    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('profiles')
      .update({ is_public: true, slug })
      .eq('id', profile.id)

    if (err) {
      if (err.code === '23505') {
        setError('This slug is already taken')
      } else {
        setError('Failed to publish')
      }
      setLoading(false)
      return
    }

    const url = `${window.location.origin}/${slug}`
    onPublished(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-card border border-border p-8 max-w-sm w-full space-y-6">
        <h2 className="text-2xl font-bold text-text">Publish Your Portfolio</h2>

        <div>
          <label className="block text-sm font-semibold text-text mb-2">Portfolio URL</label>
          <div className="flex items-center gap-2">
            <span className="text-muted">{window.location.origin}/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-btn bg-bg text-text focus:outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-subtle-bg text-text rounded-btn font-semibold transition hover:bg-border-light"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-accent text-card rounded-btn font-semibold transition hover:bg-accent disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
