import { createClient } from '@/lib/supabase/server'
import type { Project, CareerEntry, ContactLink } from '@/types'
import { notFound } from 'next/navigation'

export default async function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const [{ data: projects }, { data: career }, { data: contacts }] = await Promise.all([
    supabase.from('projects').select('*').eq('profile_id', profile.id).order('position'),
    supabase.from('career_entries').select('*').eq('profile_id', profile.id).order('position'),
    supabase.from('contact_links').select('*').eq('profile_id', profile.id).order('position'),
  ])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-3">

        {/* Hero */}
        <div className="bg-card rounded-2xl border border-border p-6 flex items-center gap-5">
          <div className="w-[72px] h-[72px] bg-tag-bg rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
            {profile.avatar_emoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text mb-1">{profile.name}</h1>
            <p className="text-sm text-muted leading-relaxed">{profile.tagline}</p>
          </div>
        </div>

        {/* Skills ticker */}
        {profile.skills?.length > 0 && (
          <div className="w-full overflow-hidden whitespace-nowrap py-2 relative">
            <div className="inline-flex gap-0" style={{animation:'ticker 25s linear infinite'}}>
              {[...profile.skills, ...profile.skills].map((skill: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 text-[11px] font-semibold tracking-[0.8px] uppercase text-placeholder">
                  <span className="text-accent text-sm">+</span>{skill}
                </span>
              ))}
            </div>
            <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <span className="text-[10px] font-bold text-placeholder tracking-[1.5px] uppercase">Projects</span>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              {projects.map((p: Project) => (
                <div key={p.id} className="rounded-xl border border-border overflow-hidden bg-card">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} className="w-full h-[140px] object-cover" />
                  ) : (
                    <div className="w-full h-[140px] bg-gradient-to-br from-tag-bg to-border flex items-center justify-center">
                      <span className="text-xs font-mono text-placeholder">[ project cover ]</span>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-text mb-1">{p.title}</h3>
                    {p.description && <p className="text-xs text-muted line-clamp-2 mb-2">{p.description}</p>}
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 text-[11px] font-medium bg-tag-bg text-muted rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career */}
        {career && career.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <span className="text-[10px] font-bold text-placeholder tracking-[1.5px] uppercase">Career Ladder</span>
            </div>
            <div className="px-5 pb-4 divide-y divide-tag-bg">
              {career.map((e: CareerEntry) => (
                <div key={e.id} className="flex gap-4 py-4">
                  <span className="text-2xl flex-shrink-0">{e.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-text">
                        {e.role}{e.company ? ` @ ${e.company}` : ''}
                      </span>
                      {e.date_range && (
                        <span className="text-xs font-medium text-muted bg-tag-bg px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                          {e.date_range}
                        </span>
                      )}
                    </div>
                    {e.description && <p className="text-xs text-muted leading-relaxed">{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {contacts && contacts.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <span className="text-[10px] font-bold text-placeholder tracking-[1.5px] uppercase">Contact</span>
            </div>
            <div className="px-5 pb-5 space-y-2.5">
              {contacts.filter((c: ContactLink) => c.type === 'email').map((c: ContactLink) => (
                <a key={c.id} href={`mailto:${c.url}`}
                  className="flex items-center justify-between border border-border-light rounded-xl px-4 py-3 text-sm hover:border-accent transition cursor-pointer">
                  <span className="text-muted">{c.url}</span>
                  <span className="text-placeholder text-base">@</span>
                </a>
              ))}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {contacts.filter((c: ContactLink) => c.type !== 'email').map((c: ContactLink) => (
                  <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 border border-border-light rounded-full text-sm font-medium text-text hover:border-accent transition">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#9B9B9B" strokeWidth="1.5"/><path d="M5 8h6M8 5v6" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, tagline')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!profile) return { title: 'Portfolio not found' }

  return {
    title: `${profile.name} — Portfolio`,
    description: profile.tagline || 'Design portfolio',
    openGraph: {
      title: `${profile.name} — Portfolio`,
      description: profile.tagline || 'Design portfolio',
    },
  }
}
