'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types'
import ProjectCard from './ProjectCard'
import ImageUpload from './ImageUpload'

export default function ProjectsSection({ profileId, projects: initialProjects }: { profileId: string; projects: Project[] }) {
  const supabase = createClient()
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddProject = async () => {
    if (!title) return
    setLoading(true)
    
    const { data, error } = await supabase.from('projects').insert({
      profile_id: profileId,
      title,
      description,
      cover_url: coverUrl,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      position: projects.length,
    }).select().single()

    if (!error && data) {
      setProjects([...projects, data])
      setTitle('')
      setDescription('')
      setTags('')
      setCoverUrl('')
      setShowForm(false)
      setEditingId(data.id)
    }
    setLoading(false)
  }

  const handleUpdateCover = async (projectId: string, url: string) => {
    await supabase.from('projects').update({ cover_url: url }).eq('id', projectId)
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, cover_url: url } : p)))
  }

  const handleDeleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter((p) => p.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const editingProject = editingId ? projects.find((p) => p.id === editingId) : null

  return (
    <section className="w-full max-w-xl space-y-3">
      <div className="flex items-center justify-between px-5">
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Projects</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="text-xs font-semibold text-accent hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      <div className="bg-card rounded-card border border-border-light overflow-hidden">
        {showForm && (
          <div className="border-b border-border p-5 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent h-16"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full px-3 py-2 border border-border rounded-sm bg-card text-text text-sm focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleAddProject}
              disabled={!title || loading}
              className="w-full px-3 py-2 bg-text text-card rounded-sm font-semibold text-sm transition hover:bg-muted disabled:opacity-50"
            >
              Create & Add Cover
            </button>
          </div>
        )}

        {editingProject && (
          <div className="border-b border-border p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-text text-sm">{editingProject.title}</h3>
              <button
                onClick={() => setEditingId(null)}
                className="text-accent hover:underline text-xs"
              >
                Done
              </button>
            </div>
            <ImageUpload
              userId={profileId}
              projectId={editingProject.id}
              currentUrl={editingProject.cover_url}
              onUpload={(url) => handleUpdateCover(editingProject.id, url)}
            />
          </div>
        )}

        {projects.length === 0 && !showForm ? (
          <div className="px-5 py-12 text-center">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-semibold text-text mb-1">No projects yet</p>
            <p className="text-xs text-muted">Start by adding your first project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-5">
            {projects.map((p) => (
              <div key={p.id}>
                <ProjectCard
                  project={p}
                  onEdit={() => setEditingId(p.id)}
                  onDelete={() => handleDeleteProject(p.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
