'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ImageUpload({
  userId,
  projectId,
  currentUrl,
  onUpload,
}: {
  userId: string
  projectId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const path = `${userId}/${projectId}/cover`
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
      onUpload(data.publicUrl)
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        {currentUrl ? (
          <div className="relative aspect-video rounded-card overflow-hidden border border-border">
            <img src={currentUrl} alt="Project cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 bg-white text-black rounded-btn font-semibold text-sm transition hover:bg-gray-200 disabled:opacity-50"
              >
                Change image
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full aspect-video rounded-card border-2 border-dashed border-border bg-subtle-bg hover:bg-border-light transition flex items-center justify-center disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm font-semibold text-text">Add cover image</div>
              <div className="text-xs text-muted">Click or drag to upload</div>
            </div>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={loading}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-muted">Uploading...</p>}
    </div>
  )
}
