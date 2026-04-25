const levels = [
  { id: 'junior', label: 'Just starting out', emoji: '😊', sub: '0–2 years' },
  { id: 'mid', label: 'Intermediate', emoji: '🤩', sub: '2–5 years' },
  { id: 'senior', label: 'Advanced', emoji: '🤓', sub: '5+ years' },
]

export default function Step3Experience({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">Experience level?</h2>
      <p className="text-muted mb-8">Help us understand where you are</p>
      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onChange(level.id)}
            className={`w-full p-6 rounded-card border-2 transition-all text-left ${
              selected === level.id
                ? 'border-accent bg-subtle-bg'
                : 'border-border bg-card hover:border-border-light'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{level.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-text">{level.label}</div>
                <div className="text-sm text-muted">{level.sub}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
