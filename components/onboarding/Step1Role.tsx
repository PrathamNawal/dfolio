const roles = [
  { id: 'pd', label: 'Product Designer', emoji: '🎨' },
  { id: 'ux', label: 'UX Researcher', emoji: '🔍' },
  { id: 'gd', label: 'Graphic Designer', emoji: '✏️' },
  { id: 'md', label: 'Motion Designer', emoji: '🎬' },
  { id: 'bd', label: 'Brand Designer', emoji: '💎' },
  { id: 'il', label: 'Illustrator', emoji: '🖌️' },
  { id: 'ot', label: 'Others', emoji: '✨' },
]

export default function Step1Role({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">What's your role?</h2>
      <p className="text-muted mb-8">Choose the one that fits you best</p>
      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onChange(role.id)}
            className={`p-6 rounded-card border-2 transition-all text-center ${
              selected === role.id
                ? 'border-accent bg-subtle-bg'
                : 'border-border bg-card hover:border-border-light'
            }`}
          >
            <div className="text-3xl mb-3">{role.emoji}</div>
            <div className="font-semibold text-text text-sm">{role.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
