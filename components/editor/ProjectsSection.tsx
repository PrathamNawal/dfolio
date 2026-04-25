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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Projects</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="px-4 py-2 bg-accent text-card rounded-btn font-semibold text-sm"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-card border border-border p-6 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent h-24"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full px-4 py-3 border border-border rounded-btn bg-card text-text placeholder-placeholder focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleAddProject}
            disabled={!title || loading}
            className="w-full px-4 py-3 bg-accent text-card rounded-btn font-semibold transition hover:bg-accent disabled:opacity-50"
          >
            Create & Add Cover
          </button>
        </div>
      )}

      {editingProject && (
        <div className="bg-card rounded-card border border-border p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">{editingProject.title}</h3>
            <button
              onClick={() => setEditingId(null)}
              className="text-accent hover:underline text-sm"
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

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted mb-4">No projects yet. Start by adding your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="space-y-2">
              <ProjectCard
                project={p}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => handleDeleteProject(p.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
