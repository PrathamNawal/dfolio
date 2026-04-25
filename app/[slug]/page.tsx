import { createClient } from '@/lib/supabase/server'
import type { Project, CareerEntry, ContactLink } from '@/types'
import { notFound } from 'next/navigation'

export default async function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const [{ data: projects }, { data: career }, { data: contacts }] = await Promise.all([
    supabase.from('projects').select('*').eq('profile_id', profile.id).order('position'),
    supabase.from('career_entries').select('*').eq('profile_id', profile.id).order('position'),
    supabase.from('contact_links').select('*').eq('profile_id', profile.id).order('position'),
  ])

  return (
    <div className={profile.dark_mode ? 'dark' : ''}>
      <div className="min-h-screen bg-bg text-text">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
          {/* Hero */}
          <div className="bg-card rounded-card border border-border p-12 text-center space-y-4">
            <div className="text-5xl mb-4">{profile.avatar_emoji}</div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted">{profile.tagline}</p>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="border-y border-border bg-subtle-bg py-6 overflow-hidden">
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-tag-bg text-text rounded-pill text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <div className="grid grid-cols-2 gap-6">
                {projects.map((p: Project) => (
                  <div key={p.id} className="bg-card rounded-card border border-border overflow-hidden">
                    {p.cover_url ? (
                      <img src={p.cover_url} alt={p.title} className="w-full aspect-video object-cover" />
                    ) : (
                      <div className="w-full aspect-video bg-subtle-bg" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{p.title}</h3>
                      <p className="text-sm text-muted line-clamp-2">{p.description}</p>
                      {p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {p.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-tag-bg rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Career */}
          {career && career.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Career</h2>
              <div className="space-y-3">
                {career.map((e: CareerEntry) => (
                  <div key={e.id} className="bg-card rounded-card border border-border p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{e.emoji}</span>
                      <div>
                        <div className="font-semibold">{e.role}</div>
                        <div className="text-sm text-muted">{e.company}</div>
                        {e.date_range && <div className="text-xs text-placeholder mt-1">{e.date_range}</div>}
                        {e.description && <p className="text-sm mt-2">{e.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          {contacts && contacts.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Contact</h2>
              <div className="space-y-2">
                {contacts.map((c: ContactLink) => (
                  <a
                    key={c.id}
                    href={c.type === 'email' ? `mailto:${c.url}` : c.url}
                    target={c.type !== 'email' ? '_blank' : undefined}
                    rel={c.type !== 'email' ? 'noopener noreferrer' : undefined}
                    className="block px-4 py-3 bg-card border border-border rounded-btn hover:border-accent transition"
                  >
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-sm text-muted truncate">{c.url}</div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_public', true)
    .single()

  if (!profile) {
    return { title: 'Portfolio not found' }
  }

  return {
    title: `${profile.name} — Product Designer Portfolio`,
    description: profile.tagline || 'Portfolio',
    openGraph: {
      title: `${profile.name} — Product Designer Portfolio`,
      description: profile.tagline || 'Portfolio',
    },
  }
}
