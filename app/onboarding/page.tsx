'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import ProgressBar from '@/components/onboarding/ProgressBar'
import Step1Role from '@/components/onboarding/Step1Role'
import Step2Goal from '@/components/onboarding/Step2Goal'
import Step3Experience from '@/components/onboarding/Step3Experience'
import Step4Strengths from '@/components/onboarding/Step4Strengths'

export default function OnboardingPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const handleNext = () => {
    if (step === 1) {
      if (!role) return
      setStep(2)
    } else if (step === 2) {
      if (!goal) return
      setStep(3)
    } else if (step === 3) {
      if (!experience) return
      setStep(4)
    }
  }

  const handleBack = () => setStep(Math.max(1, step - 1))

  const generateSlug = (fullName: string) => {
    return fullName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  const handleComplete = async () => {
    if (!name || skills.length < 3 || !supabase) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const slug = generateSlug(name)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name,
        slug,
        role,
        goal,
        experience,
        skills,
        tagline: '',
        avatar_emoji: '🏋️',
      })

      if (error) throw error
      router.push('/editor')
    } catch (error) {
      console.error('Onboarding failed:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-md mx-auto mt-12">
        <ProgressBar step={step} />

        <div className="bg-card rounded-card border border-border p-8 space-y-8">
          {step === 1 && <Step1Role selected={role} onChange={setRole} />}
          {step === 2 && <Step2Goal selected={goal} onChange={setGoal} />}
          {step === 3 && <Step3Experience selected={experience} onChange={setExperience} />}
          {step === 4 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-2">Let's start with your name</h2>
                <p className="text-muted mb-6">This will be shown on your portfolio</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent mb-8"
                />
              </div>
              <Step4Strengths selected={skills} onChange={setSkills} />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-3 bg-subtle-bg text-text rounded-btn font-semibold transition hover:bg-border-light"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !role) ||
                (step === 2 && !goal) ||
                (step === 3 && !experience)
              }
              className="flex-1 px-4 py-3 bg-accent text-card rounded-btn font-semibold transition hover:bg-accent disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || !name || skills.length < 3 || !supabase}
              className="flex-1 px-4 py-3 bg-accent text-card rounded-btn font-semibold transition hover:bg-accent disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
