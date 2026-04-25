const allSkills = [
  'Visual Design', 'UX/UI Design', 'Prototyping', 'User Research', 'Figma',
  'Design Systems', 'Interaction Design', 'Information Architecture',
  'Usability Testing', 'Motion Design', 'Accessibility', 'Design Thinking',
  'Wireframing', 'Typography', 'Brand Identity', 'Design Strategy',
  'Service Design', 'Content Design', 'Design Leadership', 'Workshop Facilitation',
]

export default function Step4Strengths({ selected, onChange }: { selected: string[]; onChange: (skills: string[]) => void }) {
  const toggle = (skill: string) => {
    onChange(selected.includes(skill) ? selected.filter((s) => s !== skill) : [...selected, skill])
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">Your strengths</h2>
      <p className="text-muted mb-8">Pick at least 3 skills you're good at</p>
      <div className="flex flex-wrap gap-2">
        {allSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => toggle(skill)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all ${
              selected.includes(skill)
                ? 'bg-accent text-card'
                : 'bg-tag-bg text-text hover:bg-subtle-bg'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-sm text-muted mt-6">Selected: {selected.length}</p>
      )}
    </div>
  )
}
