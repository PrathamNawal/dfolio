const goals = [
  { id: 'hired', label: 'Get Hired', emoji: '🤝', sub: 'Land your next design role' },
  { id: 'brand', label: 'Personal Branding', emoji: '🤘', sub: 'Build your presence online' },
]

export default function Step2Goal({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">What's your goal?</h2>
      <p className="text-muted mb-8">This helps us personalize your portfolio</p>
      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onChange(goal.id)}
            className={`w-full p-6 rounded-card border-2 transition-all text-left ${
              selected === goal.id
                ? 'border-accent bg-subtle-bg'
                : 'border-border bg-card hover:border-border-light'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{goal.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-text">{goal.label}</div>
                <div className="text-sm text-muted">{goal.sub}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
