'use client'

import type { Profile } from '@/types'

export default function SkillsTicker({ skills }: { skills: string[] }) {
  if (!skills.length) return null

  return (
    <div className="w-full max-w-xl overflow-hidden whitespace-nowrap relative">
      <div className="inline-flex gap-0 animate-scroll">
        {[...skills, ...skills].map((skill, i) => (
          <div key={i} className="inline-flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-widest px-4">
              {skill}
            </span>
            <span className="text-accent text-sm flex-shrink-0">•</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
