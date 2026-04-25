'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, Project, CareerEntry, ContactLink } from '@/types'
import EditorNav from '@/components/editor/EditorNav'
import HeroCard from '@/components/editor/HeroCard'
import SkillsTicker from '@/components/editor/SkillsTicker'
import ProjectsSection from '@/components/editor/ProjectsSection'
import CareerSection from '@/components/editor/CareerSection'
import ContactSection from '@/components/editor/ContactSection'
import ThemePanel from '@/components/editor/ThemePanel'

// Template canvas styles
const templateStyles: Record<string, React.CSSProperties> = {
  canvas: { background: '#F5F4F0' },
  mono: {
    background: '#FAFAFA',
    filter: 'grayscale(1)',
  },
  gridline: {
    background: '#fff',
    backgroundImage:
      'linear-gradient(#E0DED8 1px, transparent 1px), linear-gradient(90deg, #E0DED8 1px, transparent 1px)',
    backgroundSize: '16px 16px',
  },
  spotlight: {
    background: '#111',
    filter: 'invert(1) hue-rotate(180deg)',
  },
}

// Fix hydration: render date only on client
function DateBar({ darkMode, onToggleDarkMode }: { darkMode: boolean; onToggleDarkMode: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    setMounted(true)
    setNow(new Date())
    const iv = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="w-full max-w-[600px] bg-card rounded-xl border border-border flex items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm font-medium text-text">
        {mounted ? (
          <>
            <span>{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </>
        ) : (
          <span className="text-muted">Loading…</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="#9B9B9B" strokeWidth="1.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <button
          onClick={onToggleDarkMode}
          className={`w-9 h-5 rounded-full transition-colors border-none relative flex-shrink-0 ${darkMode ? 'bg-text' : 'bg-border-light'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-4' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  )
}

export default function EditorPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [career, setCareer] = useState<CareerEntry[]>([])
  const [contacts, setContacts] = useState<ContactLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showTheme, setShowTheme] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('canvas')

  useEffect(() => {
    const client = createClient()
    setSupabase(client)

    const fetchProfile = async () => {
      const { data: { user } } = await client.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await client.from('profiles').select('*').eq('id', user.id).single()
      if (!profileData) { router.push('/onboarding'); return }

      setProfile(profileData)
      setDarkMode(profileData.dark_mode || false)
      setLoading(false)

      const [projectsRes, careerRes, contactsRes] = await Promise.all([
        client.from('projects').select('*').eq('profile_id', user.id).order('position'),
        client.from('career_entries').select('*').eq('profile_id', user.id).order('position'),
        client.from('contact_links').select('*').eq('profile_id', user.id).order('position'),
      ])

      if (projectsRes.data) setProjects(projectsRes.data)
      if (careerRes.data) setCareer(careerRes.data)
      if (contactsRes.data) setContacts(contactsRes.data)
    }

    fetchProfile()
  }, [router])

  const handleProfileUpdate = (field: string, value: string | boolean) => {
    if (profile) setProfile({ ...profile, [field]: value })
  }

  const handleToggleDarkMode = async () => {
    const newVal = !darkMode
    setDarkMode(newVal)
    if (profile && supabase) {
      await supabase.from('profiles').update({ dark_mode: newVal }).eq('id', profile.id)
      handleProfileUpdate('dark_mode', newVal)
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  if (loading || !profile) return null

  // Spotlight template already inverts, dark mode handled separately
  const canvasStyle = templateStyles[selectedTemplate] ?? templateStyles.canvas
  const rootStyle: React.CSSProperties =
    selectedTemplate !== 'spotlight' && darkMode
      ? { ...canvasStyle, filter: [canvasStyle.filter, 'invert(1) hue-rotate(180deg)'].filter(Boolean).join(' ') }
      : canvasStyle

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={rootStyle}>
      <EditorNav
        profile={profile}
        onPublish={() => handleProfileUpdate('is_public', true)}
        showTheme={showTheme}
        onToggleTheme={() => setShowTheme(!showTheme)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center gap-3">
          <DateBar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
          <HeroCard profile={profile} onUpdate={handleProfileUpdate} />
          {profile.skills.length > 0 && <SkillsTicker skills={profile.skills} />}
          <ProjectsSection profileId={profile.id} projects={projects} />
          <CareerSection profileId={profile.id} entries={career} />
          <ContactSection profileId={profile.id} links={contacts} />
          <div className="h-10" />
        </div>

        {/* Right sidebar — Theme panel */}
        {showTheme && (
          <ThemePanel
            darkMode={darkMode}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onToggleDarkMode={handleToggleDarkMode}
            onClose={() => setShowTheme(false)}
          />
        )}
      </div>
    </div>
  )
}
