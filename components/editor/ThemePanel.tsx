'use client'

import { useState } from 'react'

const tabs = ['Layouts', 'Background', 'Blocks', 'Cursors']

const templates = [
  { id: 'canvas', name: 'Canvas', badge: null },
  { id: 'mono', name: 'Mono', badge: null },
  { id: 'gridline', name: 'Gridline', badge: 'New' },
  { id: 'spotlight', name: 'Spotlight', badge: 'Pro' },
]

const bgColors = ['#F5F4F0', '#FFFFFF', '#1A1A1A', '#E8F4F0', '#FFF3E0']

function TemplatePreview({ id }: { id: string }) {
  if (id === 'canvas') return (
    <svg viewBox="0 0 110 70" width="100%" height="100%" style={{background:'#F5F4F0'}}>
      <rect x="8" y="8" width="94" height="54" rx="5" fill="#fff" opacity="0.8"/>
      <rect x="14" y="14" width="35" height="18" rx="3" fill="#E8704A" opacity="0.6"/>
      <rect x="14" y="36" width="80" height="6" rx="2" fill="#1A1A1A" opacity="0.15"/>
      <rect x="14" y="46" width="60" height="4" rx="2" fill="#1A1A1A" opacity="0.1"/>
    </svg>
  )
  if (id === 'mono') return (
    <svg viewBox="0 0 110 70" width="100%" height="100%" style={{background:'#FAFAFA'}}>
      <rect x="8" y="8" width="94" height="54" rx="5" fill="#fff" opacity="0.8"/>
      <rect x="14" y="14" width="20" height="20" rx="2" fill="#1A1A1A" opacity="0.8"/>
      <rect x="40" y="16" width="50" height="6" rx="2" fill="#1A1A1A" opacity="0.3"/>
      <rect x="40" y="26" width="35" height="4" rx="2" fill="#1A1A1A" opacity="0.15"/>
      <rect x="14" y="38" width="80" height="4" rx="2" fill="#1A1A1A" opacity="0.1"/>
    </svg>
  )
  if (id === 'gridline') return (
    <svg viewBox="0 0 110 70" width="100%" height="100%" style={{background:'#fff'}}>
      {[0,1,2,3,4,5].map(i=><line key={`h${i}`} x1="0" y1={i*14} x2="110" y2={i*14} stroke="#E0DED8" strokeWidth="0.5"/>)}
      {[0,1,2,3,4,5,6,7].map(i=><line key={`v${i}`} x1={i*16} y1="0" x2={i*16} y2="70" stroke="#E0DED8" strokeWidth="0.5"/>)}
      <rect x="14" y="8" width="82" height="24" rx="3" fill="#1A1A1A" opacity="0.85"/>
      <rect x="14" y="36" width="38" height="26" rx="3" fill="#F0EDEA"/>
      <rect x="56" y="36" width="40" height="26" rx="3" fill="#F0EDEA"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 110 70" width="100%" height="100%" style={{background:'#111'}}>
      <rect x="25" y="20" width="60" height="8" rx="2" fill="#fff" opacity="0.8"/>
      <rect x="35" y="33" width="40" height="4" rx="2" fill="#fff" opacity="0.4"/>
      <rect x="40" y="42" width="30" height="4" rx="2" fill="#fff" opacity="0.25"/>
    </svg>
  )
}

export default function ThemePanel({
  darkMode,
  onToggleDarkMode,
  onClose,
}: {
  darkMode: boolean
  onToggleDarkMode: () => void
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState('Layouts')
  const [selectedTemplate, setSelectedTemplate] = useState('canvas')
  const [selectedBg, setSelectedBg] = useState(0)

  return (
    <div className="w-[280px] bg-card border-l border-border flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-tag-bg">
        <span className="text-sm font-semibold text-text">Theme Settings</span>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md bg-tag-bg border-none flex items-center justify-center text-sm text-muted hover:bg-border-light transition"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-5 py-3 gap-0.5 border-b border-tag-bg">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border-none transition ${
              activeTab === t
                ? 'bg-tag-bg text-text font-semibold'
                : 'bg-transparent text-placeholder hover:text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-5 flex-1">
        {activeTab === 'Layouts' && (
          <>
            {/* Appearance / dark mode toggle */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-text">Appearance</span>
              <button
                onClick={onToggleDarkMode}
                className={`w-9 h-5 rounded-full transition-colors border-none flex-shrink-0 relative ${darkMode ? 'bg-text' : 'bg-border-light'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-4' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Templates label */}
            <div className="text-[11px] font-semibold text-placeholder tracking-widest uppercase mb-3">Templates</div>

            {/* Template grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative ${
                    selectedTemplate === t.id ? 'border-accent' : 'border-transparent hover:border-border'
                  }`}
                >
                  <div className="h-[90px] rounded-lg overflow-hidden">
                    <TemplatePreview id={t.id} />
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
                        <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1.5 pb-0.5 px-0.5 text-xs font-medium text-text">
                    {t.name}
                    {t.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.badge === 'Pro' ? 'bg-orange-50 text-accent' : 'bg-tag-bg text-placeholder'}`}>
                        {t.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'Background' && (
          <>
            <div className="text-[11px] font-semibold text-placeholder tracking-widest uppercase mb-3">Color</div>
            <div className="flex gap-2 flex-wrap">
              {bgColors.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setSelectedBg(i)}
                  className="w-7 h-7 rounded-full border-none transition-transform"
                  style={{
                    background: c,
                    border: selectedBg === i ? '2px solid #1A1A1A' : '2px solid #E2E0DA',
                    transform: selectedBg === i ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {(activeTab === 'Blocks' || activeTab === 'Cursors') && (
          <div className="text-sm text-placeholder text-center mt-10">Coming soon</div>
        )}
      </div>
    </div>
  )
}
