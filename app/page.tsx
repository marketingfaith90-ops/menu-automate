'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Template } from '@/lib/types'

type View = 'templates' | 'create'

export default function Dashboard() {
  const router = useRouter()
  const [view, setView] = useState<View>('create')
  const [templates, setTemplates] = useState<Template[]>([])
  const [selected, setSelected] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('templates').select('*').then(({ data }) => {
      if (data) setTemplates(data as Template[])
      setLoading(false)
    })
  }, [])

  const s = {
    app: { display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'system-ui, sans-serif' } as React.CSSProperties,
    sidebar: { width: 220, background: '#1a1a1a', borderRight: '1px solid #2a2a2a', padding: '24px 0', flexShrink: 0 } as React.CSSProperties,
    logo: { padding: '0 20px 24px', borderBottom: '1px solid #2a2a2a', marginBottom: 16 } as React.CSSProperties,
    logoText: { fontSize: 18, fontWeight: 700, color: '#C8A042' } as React.CSSProperties,
    navItem: (active: boolean): React.CSSProperties => ({
      display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px',
      background: active ? '#C8A042' : 'transparent', color: active ? '#000' : '#ccc',
      border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: active ? 600 : 400,
    }),
    main: { flex: 1, padding: 32, overflowY: 'auto' } as React.CSSProperties,
    heading: { fontSize: 26, fontWeight: 700, marginBottom: 8 } as React.CSSProperties,
    sub: { color: '#888', marginBottom: 28, fontSize: 14 } as React.CSSProperties,
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 } as React.CSSProperties,
    card: (sel: boolean): React.CSSProperties => ({
      background: '#1a1a1a', borderRadius: 12, padding: 20, cursor: 'pointer',
      border: sel ? '2px solid #C8A042' : '2px solid #2a2a2a',
    }),
    badge: { background: '#C8A042', color: '#000', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 10 } as React.CSSProperties,
    btn: (primary: boolean): React.CSSProperties => ({
      padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15,
      background: primary ? '#C8A042' : '#2a2a2a', color: primary ? '#000' : '#ccc',
    }),
    uploadBox: { border: '2px dashed #333', borderRadius: 12, padding: 40, textAlign: 'center', color: '#666', marginTop: 20 } as React.CSSProperties,
    tplThumb: { width: '100%', height: 120, background: '#243318', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 } as React.CSSProperties,
  }

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoText}>🍽️ Menu Automate</div>
        </div>
        <button style={s.navItem(view === 'create')} onClick={() => setView('create')}>
          ✏️ &nbsp; Create Menu
        </button>
        <button style={s.navItem(view === 'templates')} onClick={() => setView('templates')}>
          📋 &nbsp; Templates
        </button>
      </div>

      {/* Main */}
      <div style={s.main}>

        {/* CREATE MENU VIEW */}
        {view === 'create' && (
          <div>
            <div style={s.heading}>Create Menu</div>
            <div style={s.sub}>Select a template below, then fill in your customer's details to generate their menu.</div>

            {loading && <p style={{ color: '#666' }}>Loading templates...</p>}

            {!loading && templates.length === 0 && (
              <div style={{ color: '#666', textAlign: 'center', marginTop: 60 }}>
                <p style={{ fontSize: 20 }}>No templates yet.</p>
                <p>Go to <b>Templates</b> to add one.</p>
              </div>
            )}

            <div style={s.grid}>
              {templates.map(t => (
                <div
                  key={t.id}
                  style={s.card(selected?.id === t.id)}
                  onClick={() => setSelected(t)}
                >
                  <div style={s.tplThumb}>🍛</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.name}</div>
                  <div style={{ color: '#888', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{t.description}</div>
                  {selected?.id === t.id
                    ? <div style={{ ...s.badge, width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>✓ Selected</div>
                    : <div style={{ color: '#C8A042', fontSize: 13, fontWeight: 600 }}>Click to select →</div>
                  }
                </div>
              ))}
            </div>

            {selected && (
              <div style={{ marginTop: 32, padding: 24, background: '#1a1a1a', borderRadius: 12, border: '1px solid #2a2a2a', maxWidth: 600 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Using: {selected.name}</div>
                <div style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>Your customer's menu will be built in this template's style.</div>
                <button
                  style={s.btn(true)}
                  onClick={() => router.push(`/create/${selected.id}`)}
                >
                  Continue — Fill Business Details →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TEMPLATES VIEW */}
        {view === 'templates' && (
          <div>
            <div style={s.heading}>Templates</div>
            <div style={s.sub}>These are your saved menu templates. Each template is a design style you can use for new customers.</div>

            <div style={s.grid}>
              {templates.map(t => (
                <div key={t.id} style={s.card(false)}>
                  <div style={s.tplThumb}>🍛</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.name}</div>
                  <div style={{ color: '#888', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{t.description}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={s.btn(true)} onClick={() => { setSelected(t); setView('create') }}>
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.uploadBox}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📤</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#888' }}>Upload New Template</div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
                Send your template design to Anis and it will be added here for all customers.
              </div>
              <div style={{ fontSize: 12, color: '#444' }}>Coming soon — contact support to add new templates</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
