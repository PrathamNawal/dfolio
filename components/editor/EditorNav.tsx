'use client'

import { useState } from 'react'
import PublishModal from './PublishModal'
import type { Profile } from '@/types'

export default function EditorNav({ profile, onPublish }: { profile: Profile; onPublish: (url: string) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const publicUrl = profile.is_public && profile.slug ? `${window.location.origin}/${profile.slug}` : null

  return (
    <>
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="text-lg font-bold text-text">DFolio</div>
          <div className="flex gap-4">
            {publicUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl)
                  alert('Link copied!')
                }}
                className="text-sm text-accent hover:underline"
              >
                Copy link
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-accent text-card rounded-btn font-semibold text-sm transition hover:bg-accent/90"
            >
              {publicUrl ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </nav>

      {showModal && (
        <PublishModal
          profile={profile}
          onClose={() => setShowModal(false)}
          onPublished={(url) => {
            setPublishedUrl(url)
            setShowModal(false)
            onPublish(url)
          }}
        />
      )}

      {publishedUrl && (
        <div className="bg-green-50 border-b border-green-200 px-8 py-3 text-sm text-green-700 text-center">
          ✓ Published at{' '}
          <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            {publishedUrl}
          </a>
        </div>
      )}
    </>
  )
}
