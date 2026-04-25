export default function ProgressBar({ step }: { step: number }) {
  const segments = [1, 2, 3, 4]
  const colors = ['bg-accent', 'bg-accent', 'bg-accent', 'bg-accent']
  
  return (
    <div className="flex gap-2 mb-8">
      {segments.map((s) => (
        <div
          key={s}
          className={`flex-1 h-1 rounded-full transition-all ${
            s < step ? colors[s - 1] : s === step ? 'bg-accent' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}
