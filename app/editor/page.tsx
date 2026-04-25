'use client'

import { useState, useEffect } from 'react'
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

export default function EditorPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [career, setCareer] = useState<CareerEntry[]>([])
  const [contacts, setContacts] = useState<ContactLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)

    const fetchProfile = async () => {
      const { data: { user } } = await client.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await client.from('profiles').select('*').eq('id', user.id).single()
      if (!profileData) {
        router.push('/onboarding')
        return
      }

      setProfile(profileData)

      const [projectsRes, careerRes, contactsRes] = await Promise.all([
        client.from('projects').select('*').eq('profile_id', user.id).order('position'),
        client.from('career_entries').select('*').eq('profile_id', user.id).order('position'),
        client.from('contact_links').select('*').eq('profile_id', user.id).order('position'),
      ])

      if (projectsRes.data) setProjects(projectsRes.data)
      if (careerRes.data) setCareer(careerRes.data)
      if (contactsRes.data) setContacts(contactsRes.data)

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleProfileUpdate = (field: string, value: string | boolean) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  const handlePublish = (url: string) => {
    if (profile) {
      setProfile({ ...profile, is_public: true })
    }
  }

  if (loading || !profile) return null

  return (
    <div className="min-h-screen bg-bg">
      <EditorNav profile={profile} onPublish={handlePublish} />
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
        <HeroCard profile={profile} onUpdate={handleProfileUpdate} />
        {profile.skills.length > 0 && <SkillsTicker skills={profile.skills} />}
        <ProjectsSection profileId={profile.id} projects={projects} />
        <CareerSection profileId={profile.id} entries={career} />
        <ContactSection profileId={profile.id} links={contacts} />
        <ThemePanel profile={profile} onUpdate={(val) => handleProfileUpdate('dark_mode', val)} />
      </div>
    </div>
  )
}
