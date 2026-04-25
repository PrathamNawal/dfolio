'use client'

import type { Project } from '@/types'

export default function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-card rounded-sm border border-border-light overflow-hidden cursor-pointer hover:border-accent transition group">
      <div className="h-35 bg-gradient-to-br from-tag-bg to-empty-bg flex items-center justify-center">
        {project.cover_url ? (
          <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-mono text-placeholder">Add image</span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-text text-sm mb-1">{project.title}</h3>
        <p className="text-xs text-muted line-clamp-2">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-tag-bg text-text rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
