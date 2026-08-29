'use client'
import { useState } from 'react'
import { MenuData } from '@/lib/types'

interface Props {
  defaultData: MenuData
  onConfirm: (data: MenuData) => void
}

export default function BusinessSetupModal({ defaultData, onConfirm }: Props) {
  const [form, setForm] = useState({
    restaurantName: '',
    tagline: defaultData?.tagline || 'Indian Takeaway',
    phone: defaultData?.phone || '',
    website: defaultData?.website || '',
    address: defaultData?.address || '',
    hours: defaultData?.hours || 'Open 7 Days a Week\n5PM – Late',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.restaurantName.trim()) { setError('Business name is required'); return }
    const merged: MenuData = {
      ...defaultData,
      ...form,
      logo: logoPreview || defaultData?.logo || '',
      sections: defaultData?.sections || [],
    }
    onConfirm(merged)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#1e1e1e', border: '1px solid #333', borderRadius: 8,
    color: '#fff', padding: '10px 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>

        <div style={{ color: '#C8A042', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>USING: INDIAN CLASSIC</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, fontFamily: 'serif' }}>Set Up Your<br/>Business Details</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>Fill in your customer's details. Everything can be edited directly on the menu afterwards.</p>

        {/* Logo Upload */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 8 }}>BUSINESS LOGO</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, background: '#1e1e1e', border: '2px dashed #333', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ color: '#555', fontSize: 28 }}>🖼️</span>
              }
            </div>
            <div>
              <label style={{ display: 'inline-block', padding: '8px 16px', background: '#2a2a2a', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                Upload Logo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
              </label>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>PNG, JPG up to 2MB</div>
            </div>
          </div>
        </div>

        {/* Business Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>RESTAURANT / BUSINESS NAME **</label>
          <input style={{ ...inp, borderColor: error ? '#e55' : '#333' }} placeholder="e.g. Spice Garden" value={form.restaurantName} onChange={e => { set('restaurantName', e.target.value); setError('') }} />
          {error && <div style={{ color: '#e55', fontSize: 12, marginTop: 4 }}>{error}</div>}
        </div>

        {/* Tagline */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>TAGLINE</label>
          <input style={inp} placeholder="Indian Takeaway" value={form.tagline} onChange={e => set('tagline', e.target.value)} />
        </div>

        {/* Phone + Website */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>PHONE NUMBER</label>
            <input style={inp} placeholder="01234 567890" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>WEBSITE</label>
            <input style={inp} placeholder="www.yoursite.co.uk" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
        </div>

        {/* Address */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>ADDRESS</label>
          <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder={'123 High Street\nYour Town\nAB1 2CD'} value={form.address} onChange={e => set('address', e.target.value)} />
        </div>

        {/* Hours */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>OPENING HOURS</label>
          <textarea style={{ ...inp, height: 64, resize: 'vertical' }} value={form.hours} onChange={e => set('hours', e.target.value)} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ flex: 1, padding: '13px 0', background: '#1e1e1e', border: '1px solid #333', borderRadius: 10, color: '#888', cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{ flex: 2, padding: '13px 0', background: '#C8A042', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}
          >
            CREATE MY MENU →
          </button>
        </div>
      </div>
    </div>
  )
}
