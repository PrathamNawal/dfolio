'use client'

import { useState } from 'react'
import PublishModal from './PublishModal'
import type { Profile } from '@/types'

export default function EditorNav({
  profile,
  onPublish,
  showTheme,
  onToggleTheme,
}: {
  profile: Profile
  onPublish: (url: string) => void
  showTheme: boolean
  onToggleTheme: () => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  return (
    <>
      <nav className="flex items-center gap-3 px-4 py-2.5 bg-bg border-b border-border flex-shrink-0 relative z-10">
        {/* Logo */}
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-base font-bold flex-shrink-0">✳</div>

        {/* Dropdown label */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border-light text-sm font-medium text-text cursor-pointer">
          Portfolio builder
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Analytics icon */}
          <button className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center hover:bg-subtle-bg transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 3 2 3-5 3 3" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* Templates icon — toggles ThemePanel */}
          <button
            onClick={onToggleTheme}
            className={`w-8 h-8 rounded-lg border-none flex items-center justify-center transition ${showTheme ? 'bg-accent/10 text-accent' : 'bg-transparent hover:bg-subtle-bg'}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke={showTheme ? '#E8704A' : '#6B6B6B'} strokeWidth="1.5"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke={showTheme ? '#E8704A' : '#6B6B6B'} strokeWidth="1.5"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke={showTheme ? '#E8704A' : '#6B6B6B'} strokeWidth="1.5"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke={showTheme ? '#E8704A' : '#6B6B6B'} strokeWidth="1.5"/>
            </svg>
          </button>

          {/* Preview icon */}
          <button className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center hover:bg-subtle-bg transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="#6B6B6B" strokeWidth="1.5"/><path d="M2 8C3.5 4.5 12.5 4.5 14 8C12.5 11.5 3.5 11.5 2 8z" stroke="#6B6B6B" strokeWidth="1.5"/></svg>
          </button>

          {/* Publish */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 rounded-lg bg-text text-card text-sm font-semibold hover:opacity-90 transition"
          >
            {profile.is_public ? 'Update' : 'Publish'}
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-subtle-bg border border-border-light rounded-lg flex items-center justify-center text-lg cursor-pointer">
              {profile.avatar_emoji || '👤'}
            </div>
            <div className="text-[9px] font-bold text-placeholder tracking-wide">FREE</div>
          </div>
        </div>
      </nav>

      {publishedUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2.5 text-sm text-green-700 text-center">
          ✓ Published at{' '}
          <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            {publishedUrl}
          </a>
        </div>
      )}

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
    </>
  )
}
