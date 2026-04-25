'use client'

import type { Profile } from '@/types'

export default function SkillsTicker({ skills }: { skills: string[] }) {
  if (!skills.length) return null

  return (
    <div className="border-y border-border bg-subtle-bg py-6 overflow-hidden">
      <div className="animate-scroll flex gap-4 whitespace-nowrap">
        {[...skills, ...skills].map((skill, i) => (
          <span key={i} className="text-sm text-muted">
            • {skill}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
