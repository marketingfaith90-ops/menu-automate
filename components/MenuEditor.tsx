'use client'
import { useState, useRef } from 'react'
import { MenuData, MenuSection, MenuItem } from '@/lib/types'

interface Props {
  initialData: MenuData
  templateStyle: string
  onChange: (data: MenuData) => void
}

function E({ value, onChange, tag = 'span', className = '', style }: {
  value: string; onChange: (v: string) => void; tag?: string; className?: string; style?: React.CSSProperties
}) {
  const Tag = tag as any
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.currentTarget.textContent || '')}
      className={className}
      style={{ outline: 'none', cursor: 'text', minWidth: 20, ...style }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  )
}

export default function MenuEditor({ initialData, templateStyle, onChange }: Props) {
  const [data, setData] = useState<MenuData>({ ...initialData })
  const logoRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<MenuData>) => {
    const next = { ...data, ...patch }
    setData(next)
    onChange(next)
  }

  const updateSection = (id: string, patch: Partial<MenuSection>) => {
    const sections = data.sections.map(s => s.id === id ? { ...s, ...patch } : s)
    update({ sections })
  }

  const updateItem = (sectionId: string, itemId: string, patch: Partial<MenuItem>) => {
    const sections = data.sections.map(s =>
      s.id === sectionId ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } : i) } : s
    )
    update({ sections })
  }

  const addItem = (sectionId: string) => {
    const newItem: MenuItem = { id: Date.now().toString(), name: 'New Item', price: '0.00' }
    const sections = data.sections.map(s =>
      s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
    )
    update({ sections })
  }

  const removeItem = (sectionId: string, itemId: string) => {
    const sections = data.sections.map(s =>
      s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    )
    update({ sections })
  }

  const uploadImage = (ref: React.RefObject<HTMLInputElement>, field: 'logo' | 'foodPhoto') => {
    ref.current?.click()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'foodPhoto') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (field === 'logo') update({ logo: ev.target?.result as string })
      else update({ foodPhoto: ev.target?.result as string } as any)
    }
    reader.readAsDataURL(file)
  }

  const p1Left = data.sections.filter(s => s.panel === 1)
  const p1Mid = data.sections.filter(s => s.panel === 2)
  const p2Col1 = data.sections.filter(s => s.panel === 3)
  const p2Col2 = data.sections.filter(s => s.panel === 4)
  const p2Col3 = data.sections.filter(s => s.panel === 5)
  const p2Col4 = data.sections.filter(s => s.panel === 6)

  const foodPhoto = (data as any).foodPhoto

  const SectionBlock = ({ section, accentBg = '#2d4a1e', accentText = '#fff' }: { section: MenuSection; accentBg?: string; accentText?: string }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: accentBg, color: accentText, textAlign: 'center', padding: '4px 8px', marginBottom: 2 }}>
        <E value={section.title} onChange={v => updateSection(section.id, { title: v })}
          style={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', display: 'block' }} />
        {section.subtitle && (
          <E value={section.subtitle} onChange={v => updateSection(section.id, { subtitle: v })}
            style={{ fontStyle: 'italic', fontSize: 8.5, color: '#c8d8a0', display: 'block' }} />
        )}
      </div>
      {section.items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #bbb', padding: '2px 0', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <E value={item.name} onChange={v => updateItem(section.id, item.id, { name: v })}
              style={{ fontSize: 9, fontWeight: 600, color: '#2d4a1e', display: 'block' }} />
            {item.desc && (
              <E value={item.desc} onChange={v => updateItem(section.id, item.id, { desc: v })}
                style={{ fontSize: 8, color: '#666', fontStyle: 'italic', display: 'block' }} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <E value={`£${item.price}`} onChange={v => updateItem(section.id, item.id, { price: v.replace('£','') })}
              style={{ fontSize: 9, fontWeight: 600, color: '#2d4a1e', whiteSpace: 'nowrap' }} />
            <span onClick={() => removeItem(section.id, item.id)}
              style={{ cursor: 'pointer', color: '#e33', fontSize: 10, lineHeight: 1, flexShrink: 0 }}>×</span>
          </div>
        </div>
      ))}
      <button onClick={() => addItem(section.id)}
        style={{ width: '100%', border: '1px dashed #b8a060', background: 'transparent', color: '#b8a060', fontSize: 8, padding: '2px 0', cursor: 'pointer', marginTop: 2 }}>
        + ADD ITEM
      </button>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff' }}>
      {/* Hidden file inputs */}
      <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 'logo')} />
      <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 'foodPhoto')} />

      {/* ═══════════════ PAGE 1 ═══════════════ */}
      <div style={{ background: '#f5f0e8', padding: 8, marginBottom: 4, textAlign: 'center', fontSize: 10, color: '#666', letterSpacing: 2, textTransform: 'uppercase' }}>
        PAGE 1 — FULL MENU
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, background: '#fff', border: '1px solid #ddd' }}>

        {/* LEFT COLUMN */}
        <div style={{ padding: '12px 10px', borderRight: '2px solid #2d4a1e', background: '#faf8f2' }}>
          {p1Left.length > 0 ? p1Left.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 1)</p>
          )}
        </div>

        {/* MIDDLE COLUMN */}
        <div style={{ padding: '12px 10px', borderRight: '2px solid #2d4a1e', background: '#faf8f2' }}>
          {p1Mid.length > 0 ? p1Mid.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 2)</p>
          )}
        </div>

        {/* RIGHT COLUMN — COVER PANEL */}
        <div style={{ background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>

          {/* TOP: Meal Box dark section */}
          <div style={{ background: '#2d4a1e', color: '#fff', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c8d8a0', marginBottom: 2 }}>MEAL BOX</div>
            <div style={{ fontSize: 9, color: '#aaa', marginBottom: 4 }}>Collection Only</div>
            <div style={{ fontSize: 10, color: '#eee', marginBottom: 2 }}>ONLY</div>
            <E value={data.mealBox?.price || '£11.99'}
              onChange={v => update({ mealBox: { ...data.mealBox!, price: v, title: data.mealBox?.title || '', subtitle: data.mealBox?.subtitle || '', includes: data.mealBox?.includes || [] } })}
              style={{ fontSize: 28, fontWeight: 700, color: '#f0d060', display: 'block' }} />
            <div style={{ marginTop: 8, fontSize: 9, color: '#c8d8a0', textAlign: 'left' }}>
              {(data.mealBox?.includes || ['Starter', 'Side Dish', 'Pilau Rice', 'Curry of your choice']).map((inc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#f0d060' }}>◆</span>
                  <E value={inc}
                    onChange={v => {
                      const includes = [...(data.mealBox?.includes || [])]
                      includes[i] = v
                      update({ mealBox: { ...data.mealBox!, includes, title: data.mealBox?.title || '', subtitle: data.mealBox?.subtitle || '', price: data.mealBox?.price || '' } })
                    }}
                    style={{ color: '#c8d8a0', fontSize: 9 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Set Meals */}
          {data.setMeals && data.setMeals.length > 0 && (
            <div style={{ padding: '10px 14px', background: '#faf8f2', borderBottom: '1px solid #ddd' }}>
              <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: 13, color: '#2d4a1e', fontStyle: 'italic', marginBottom: 2 }}>Special Set Meals</div>
              <div style={{ textAlign: 'center', fontSize: 8, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>CHEF'S RECOMMENDATIONS</div>
              {data.setMeals.map((meal, i) => (
                <div key={meal.id} style={{ background: '#b8a060', borderRadius: 2, padding: '8px 10px', marginBottom: 6 }}>
                  <E value={meal.heading} onChange={v => {
                    const setMeals = data.setMeals!.map((m, j) => j === i ? { ...m, heading: v } : m)
                    update({ setMeals })
                  }} style={{ display: 'block', color: '#fff', fontWeight: 700, fontSize: 10, marginBottom: 2 }} />
                  <E value={meal.price} onChange={v => {
                    const setMeals = data.setMeals!.map((m, j) => j === i ? { ...m, price: v } : m)
                    update({ setMeals })
                  }} style={{ display: 'block', color: '#fff', fontWeight: 900, fontSize: 20 }} />
                  <E value={meal.body} onChange={v => {
                    const setMeals = data.setMeals!.map((m, j) => j === i ? { ...m, body: v } : m)
                    update({ setMeals })
                  }} style={{ display: 'block', color: '#f5f0d0', fontSize: 8, marginTop: 4, lineHeight: 1.4 }} />
                </div>
              ))}
            </div>
          )}

          {/* LOGO AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 14px', gap: 10 }}>

            {/* Logo upload */}
            <div onClick={() => uploadImage(logoRef, 'logo')}
              style={{ cursor: 'pointer', width: '100%', minHeight: 80, border: '2px dashed #b8a060', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
              {data.logo
                ? <img src={data.logo} style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} alt="logo" />
                : <div style={{ textAlign: 'center', color: '#b8a060', fontSize: 10 }}>
                    <div style={{ fontSize: 22 }}>🏪</div>
                    <div>Click to upload LOGO</div>
                  </div>
              }
            </div>

            {/* Restaurant name */}
            <E value={data.restaurantName} onChange={v => update({ restaurantName: v })}
              tag="div"
              style={{ fontSize: 15, fontWeight: 700, color: '#2d4a1e', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }} />

            {data.tagline && (
              <E value={data.tagline} onChange={v => update({ tagline: v })}
                tag="div"
                style={{ fontSize: 9, color: '#888', textAlign: 'center', fontStyle: 'italic' }} />
            )}

            {/* Food Hygiene Rating */}
            {data.hygiene && (
              <div style={{ border: '2px solid #2d4a1e', padding: '4px 8px', textAlign: 'center', fontSize: 8, color: '#2d4a1e' }}>
                <div style={{ fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>FOOD HYGIENE RATING</div>
                <E value={data.hygiene} onChange={v => update({ hygiene: v })}
                  style={{ fontSize: 18, fontWeight: 900, color: '#2d4a1e', display: 'block' }} />
              </div>
            )}

            {/* Food photo */}
            <div onClick={() => photoRef.current?.click()}
              style={{ cursor: 'pointer', width: '100%', minHeight: 120, border: '2px dashed #b8a060', borderRadius: 4, overflow: 'hidden', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {foodPhoto
                ? <img src={foodPhoto} style={{ width: '100%', height: 140, objectFit: 'cover' }} alt="food" />
                : <div style={{ textAlign: 'center', color: '#b8a060', fontSize: 10 }}>
                    <div style={{ fontSize: 28 }}>🍛</div>
                    <div>Click to upload food photo</div>
                  </div>
              }
            </div>

            {/* Hours */}
            {data.hours && (
              <E value={data.hours} onChange={v => update({ hours: v })}
                tag="div"
                style={{ fontWeight: 700, fontSize: 10, textAlign: 'center', color: '#2d4a1e', textTransform: 'uppercase', letterSpacing: 0.5 }} />
            )}

            {/* Address */}
            {data.address && (
              <E value={data.address} onChange={v => update({ address: v })}
                tag="div"
                style={{ fontWeight: 900, fontSize: 16, textAlign: 'center', color: '#1a1a1a', lineHeight: 1.2, textTransform: 'uppercase' }} />
            )}

            {/* Delivery note */}
            {data.deliveryNote && (
              <E value={data.deliveryNote} onChange={v => update({ deliveryNote: v })}
                tag="div"
                style={{ fontSize: 8, textAlign: 'center', color: '#555', lineHeight: 1.4 }} />
            )}

            {/* Phone */}
            {data.phone && (
              <E value={data.phone} onChange={v => update({ phone: v })}
                tag="div"
                style={{ fontWeight: 900, fontSize: 22, textAlign: 'center', color: '#1a1a1a', letterSpacing: 1 }} />
            )}

            {/* Website */}
            {data.website && (
              <E value={data.website} onChange={v => update({ website: v })}
                tag="div"
                style={{ fontSize: 9, textAlign: 'center', color: '#2d4a1e', textDecoration: 'underline' }} />
            )}

            {/* Allergy note */}
            {data.allergyNote && (
              <div style={{ background: '#e03020', color: '#fff', padding: '4px 8px', width: '100%', textAlign: 'center', borderRadius: 2 }}>
                <E value={data.allergyNote} onChange={v => update({ allergyNote: v })}
                  style={{ fontSize: 8, color: '#fff' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ PAGE 2 ═══════════════ */}
      <div style={{ background: '#f5f0e8', padding: 8, marginTop: 16, marginBottom: 4, textAlign: 'center', fontSize: 10, color: '#666', letterSpacing: 2, textTransform: 'uppercase' }}>
        PAGE 2 — FULL MENU
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, background: '#fff', border: '1px solid #ddd' }}>
        <div style={{ padding: '12px 10px', borderRight: '2px solid #2d4a1e', background: '#faf8f2' }}>
          {p2Col1.length > 0 ? p2Col1.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 3)</p>
          )}
        </div>
        <div style={{ padding: '12px 10px', borderRight: '2px solid #2d4a1e', background: '#faf8f2' }}>
          {p2Col2.length > 0 ? p2Col2.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 4)</p>
          )}
        </div>
        <div style={{ padding: '12px 10px', borderRight: '2px solid #2d4a1e', background: '#faf8f2' }}>
          {p2Col3.length > 0 ? p2Col3.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 5)</p>
          )}
        </div>
        <div style={{ padding: '12px 10px', background: '#faf8f2' }}>
          {p2Col4.length > 0 ? p2Col4.map(s => <SectionBlock key={s.id} section={s} />) : (
            <p style={{ color: '#aaa', fontSize: 10, textAlign: 'center' }}>No sections (panel 6)</p>
          )}
        </div>
      </div>
    </div>
  )
}
