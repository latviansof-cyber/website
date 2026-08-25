'use client'

import React, { useEffect, useRef } from 'react'
import { useField } from '@payloadcms/ui'
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

      const editorContainer = containerRef.current.appendChild(
        document.createElement('div'),
      )

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'clean'],
          ],
        },
      })

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value)
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
      <div className="quill-editor-container bg-white text-slate-900 border border-slate-300 rounded-lg overflow-hidden shadow-xs">
        <div ref={containerRef} className="min-h-[200px]" />
      </div>
    </div>
  )
}
