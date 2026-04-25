'use client'

import type { Project } from '@/types'

export default function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-card rounded-card border border-border overflow-hidden cursor-pointer hover:border-accent transition group">
      {project.cover_url ? (
        <img src={project.cover_url} alt={project.title} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-subtle-bg flex items-center justify-center">
          <span className="text-placeholder">No image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-text mb-1">{project.title}</h3>
        <p className="text-sm text-muted line-clamp-2">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-tag-bg text-text rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button onClick={onEdit} className="text-sm text-accent hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-sm text-accent hover:underline">
          Delete
        </button>
      </div>
    </div>
  )
}
