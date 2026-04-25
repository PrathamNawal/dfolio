'use client'

export default function SkillsTicker({ skills }: { skills: string[] }) {
  if (!skills.length) return null
  const doubled = [...skills, ...skills]

  return (
    <div className="w-full max-w-[600px] overflow-hidden whitespace-nowrap py-2 relative">
      <div className="inline-flex gap-0 animate-ticker">
        {doubled.map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-[18px] text-[11px] font-semibold tracking-[0.8px] uppercase text-placeholder">
            <span className="text-accent text-sm leading-none">+</span>
            {skill}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 25s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>
    </div>
  )
}
