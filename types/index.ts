export type Profile = {
  id: string
  slug: string | null
  name: string | null
  tagline: string | null
  avatar_emoji: string
  role: string | null
  goal: string | null
  experience: string | null
  skills: string[]
  is_public: boolean
  dark_mode: boolean
}

export type Project = {
  id: string
  profile_id: string
  title: string
  description: string | null
  cover_url: string | null
  tags: string[]
  position: number
}

export type CareerEntry = {
  id: string
  profile_id: string
  role: string
  company: string
  date_range: string | null
  description: string | null
  emoji: string
  position: number
}

export type ContactLink = {
  id: string
  profile_id: string
  type: string
  label: string
  url: string
  position: number
}
