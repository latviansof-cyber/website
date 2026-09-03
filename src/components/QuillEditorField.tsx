'use client'

import React, { useEffect, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import { normalizeYouTubeEmbeds, youtubeEmbedUrl } from '@/lib/youtubeEmbed'
import 'quill/dist/quill.snow.css'

export function QuillEditorField({ path, field }: { path: string; field: any }) {
  const { value, setValue } = useField<string>({ path })
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    let active = true

    async function initQuill() {
      if (!containerRef.current || quillRef.current) return
      const { default: Quill } = await import('quill')

      if (!active || !containerRef.current) return

      const editorContainer = containerRef.current.appendChild(document.createElement('div'))

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'video', 'clean'],
            ],
            handlers: {
              video(this: { quill: any }) {
                const input = window.prompt('Paste a YouTube URL or YouTube iframe embed code')
                if (!input) return

                const url = youtubeEmbedUrl(input)
                if (!url) {
                  window.alert('Please paste a valid YouTube URL or YouTube iframe embed code.')
                  return
                }

                const range = this.quill.getSelection(true)
                this.quill.insertEmbed(range.index, 'video', url, 'user')
                this.quill.setSelection(range.index + 1, 0, 'silent')
              },
            },
          },
        },
      })

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(normalizeYouTubeEmbeds(value))
      }

      quill.on('text-change', () => {
        if (isUpdatingRef.current) return
        const html = quill.root.innerHTML
        setValue(html === '<p><br></p>' ? '' : html)
      })

      quillRef.current = quill
    }

    initQuill()

    return () => {
      active = false
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      quillRef.current = null
    }
  }, [])

  return (
    <div className="field-type text my-4">
      <label className="field-label font-bold text-sm mb-2 block">
        {field?.label || field?.name}
      </label>
      <p className="mb-2 text-sm text-slate-600">
        Use the video button to paste a YouTube URL or YouTube iframe embed code.
      </p>
      <div className="quill-editor-container bg-white text-slate-900 border border-slate-300 rounded-lg overflow-hidden shadow-xs">
        <div ref={containerRef} className="min-h-[200px]" />
      </div>
    </div>
  )
}
