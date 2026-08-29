'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Template } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('templates')
      .select('*')
      .then(({ data }) => {
        if (data) setTemplates(data as Template[])
        setLoading(false)
      })
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Menu Automate
        </h1>
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: 18, marginBottom: 48 }}>
          Select a template to create your menu
        </p>

        {loading && <p style={{ textAlign: 'center', color: '#aaa' }}>Loading templates...</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => router.push(`/create/${t.id}`)}
              style={{
                background: '#2a2a2a',
                borderRadius: 12,
                padding: 28,
                cursor: 'pointer',
                border: '2px solid #333',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8A042')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{t.name}</h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>{t.description}</p>
              <button
                style={{
                  background: '#C8A042',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Use This Template →
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
