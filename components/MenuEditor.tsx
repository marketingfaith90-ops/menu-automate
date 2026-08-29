'use client'
import { useState, useRef } from 'react'
import { MenuData, MenuSection, MenuItem } from '@/lib/types'

interface Props {
  initialData: MenuData
  templateStyle: string
  onChange: (data: MenuData) => void
}

// Editable span
function E({ value, onChange, tag = 'span', style }: { value: string; onChange: (v: string) => void; tag?: string; style?: React.CSSProperties }) {
  const Tag = tag as any
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.currentTarget.textContent || '')}
      style={{ outline: 'none', cursor: 'text', ...style }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  )
}

export default function MenuEditor({ initialData, templateStyle, onChange }: Props) {
  const [data, setData] = useState<MenuData>(initialData)
  const fileRef = useRef<HTMLInputElement>(null)

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
      s.id === sectionId
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } : i) }
        : s
    )
    update({ sections })
  }

  const addItem = (sectionId: string) => {
    const sections = data.sections.map(s =>
      s.id === sectionId
        ? { ...s, items: [...s.items, { id: Date.now().toString(), name: 'NEW ITEM', price: '£0.00', desc: '' }] }
        : s
    )
    update({ sections })
  }

  const removeItem = (sectionId: string, itemId: string) => {
    const sections = data.sections.map(s =>
      s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    )
    update({ sections })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update({ logo: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleFoodPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update({ foodPhoto: reader.result as string } as any)
    reader.readAsDataURL(file)
  }

  const panelSections = (panel: number) => data.sections.filter(s => s.panel === panel)

  const SectionBlock = ({ section }: { section: MenuSection }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: '#243318', padding: '4px 8px', textAlign: 'center', marginBottom: 6 }}>
        <E
          value={section.title}
          onChange={v => updateSection(section.id, { title: v })}
          style={{ color: '#F4EFE3', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'serif' }}
        />
        {section.subtitle && (
          <div style={{ color: '#C8A042', fontSize: 9, fontStyle: 'italic', marginTop: 2 }}>
            <E value={section.subtitle} onChange={v => updateSection(section.id, { subtitle: v })} />
          </div>
        )}
      </div>
      {section.items.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'baseline', marginBottom: 3, gap: 2 }}>
          <div style={{ flex: 1 }}>
            <E
              value={item.name}
              onChange={v => updateItem(section.id, item.id, { name: v })}
              style={{ fontSize: 9.5, fontWeight: 700, color: '#243318', textTransform: 'uppercase', letterSpacing: 0.3 }}
            />
            {item.desc && (
              <div style={{ fontSize: 7.5, color: '#666', fontStyle: 'italic', lineHeight: 1.2 }}>
                <E value={item.desc} onChange={v => updateItem(section.id, item.id, { desc: v })} />
              </div>
            )}
          </div>
          <div style={{ borderBottom: '1px dotted #999', flex: 1, margin: '0 4px', marginBottom: 3 }} />
          <E
            value={item.price}
            onChange={v => updateItem(section.id, item.id, { price: v })}
            style={{ fontSize: 9.5, color: '#243318', fontWeight: 600, whiteSpace: 'nowrap' }}
          />
          <span
            onClick={() => removeItem(section.id, item.id)}
            style={{ color: '#c00', fontSize: 8, cursor: 'pointer', marginLeft: 3, opacity: 0.5 }}
            title="Remove"
          >✕</span>
        </div>
      ))}
      <div
        onClick={() => addItem(section.id)}
        style={{ textAlign: 'center', fontSize: 8, color: '#C8A042', cursor: 'pointer', border: '1px dashed #C8A042', padding: '2px 0', marginTop: 4, borderRadius: 2 }}
      >
        + ADD ITEM
      </div>
    </div>
  )

  const foodPhoto = (data as any).foodPhoto

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '20px 0' }}>
      <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleFoodPhotoUpload} />

      {/* PAGE 1 */}
      <div style={{ textAlign: 'center', color: '#888', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>PAGE 1 — COVER / BACK</div>
      <div style={{
        width: 960, margin: '0 auto', background: '#F4EFE3',
        display: 'grid', gridTemplateColumns: '300px 310px 1fr',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5)', marginBottom: 32
      }}>
        {/* Panel 1 — Biryani / Veg / Fish */}
        <div style={{ padding: '16px 12px', borderRight: '1px solid #ddd' }}>
          {panelSections(1).map(s => <SectionBlock key={s.id} section={s} />)}
          {panelSections(2).map(s => <SectionBlock key={s.id} section={s} />)}
          {panelSections(3).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>

        {/* Panel 2 — Rice / Breads */}
        <div style={{ padding: '16px 12px', borderRight: '1px solid #ddd' }}>
          {panelSections(4).map(s => <SectionBlock key={s.id} section={s} />)}
          {panelSections(5).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>

        {/* Panel 3 — Cover/Back: Meal Box + Set Meals + Business Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Meal Box */}
          <div style={{ background: '#243318', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ color: '#C8A042', fontSize: 16, fontWeight: 700, fontFamily: 'serif', letterSpacing: 1 }}>
              MEAL BOX
            </div>
            <div style={{ color: '#F4EFE3', fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>Collection Only</div>
            {data.mealBox && (
              <>
                <div style={{ color: '#F4EFE3', fontSize: 9, marginBottom: 2 }}>ONLY</div>
                <div style={{ color: '#F4EFE3', fontSize: 28, fontWeight: 900, fontFamily: 'serif' }}>
                  <E value={data.mealBox.price} onChange={v => update({ mealBox: { ...data.mealBox!, price: v } })} />
                </div>
                <div style={{ marginTop: 8 }}>
                  {data.mealBox.includes.map((inc, i) => (
                    <div key={i} style={{ color: '#C8A042', fontSize: 8.5, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                      <span>✦</span> {inc}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Set Meals */}
          <div style={{ background: '#F4EFE3', padding: '12px', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: 'cursive', fontSize: 16, color: '#243318' }}>Special Set Meals</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: '#666' }}>CHEFS RECOMMENDATIONS</div>
            </div>
            {data.setMeals?.map(meal => (
              <div key={meal.id} style={{ background: '#C8A042', borderRadius: 4, padding: '8px 10px', marginBottom: 8, textAlign: 'center' }}>
                <E value={meal.heading} onChange={v => {
                  const setMeals = data.setMeals!.map(m => m.id === meal.id ? { ...m, heading: v } : m)
                  update({ setMeals })
                }} style={{ fontSize: 9, fontWeight: 700, color: '#243318', display: 'block' }} />
                <E value={meal.price} onChange={v => {
                  const setMeals = data.setMeals!.map(m => m.id === meal.id ? { ...m, price: v } : m)
                  update({ setMeals })
                }} style={{ fontSize: 20, fontWeight: 900, color: '#243318', display: 'block', fontFamily: 'serif' }} />
                <E value={meal.body} onChange={v => {
                  const setMeals = data.setMeals!.map(m => m.id === meal.id ? { ...m, body: v } : m)
                  update({ setMeals })
                }} style={{ fontSize: 7.5, color: '#243318', display: 'block', lineHeight: 1.4 }} />
              </div>
            ))}
          </div>

          {/* Business Cover — Logo, Name, Address, Phone */}
          <div style={{ background: '#F4EFE3', borderTop: '2px solid #C8A042', padding: '12px', textAlign: 'center' }}>
            {/* Logo */}
            <div style={{ marginBottom: 8 }}>
              {data.logo
                ? <img src={data.logo} alt="logo" style={{ maxHeight: 80, maxWidth: '80%', objectFit: 'contain' }} />
                : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ width: 80, height: 80, border: '2px dashed #C8A042', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto', color: '#C8A042', fontSize: 10 }}
                  >
                    + LOGO
                  </div>
                )
              }
              {data.logo && (
                <label style={{ display: 'block', fontSize: 7, color: '#C8A042', cursor: 'pointer', marginTop: 2 }}>
                  Change Logo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            <E value={data.restaurantName} onChange={v => update({ restaurantName: v })}
              style={{ fontSize: 20, fontWeight: 900, color: '#243318', display: 'block', fontFamily: 'serif', letterSpacing: 1 }} />
            <E value={data.tagline || ''} onChange={v => update({ tagline: v })}
              style={{ fontSize: 9, color: '#C8A042', letterSpacing: 2, display: 'block', marginBottom: 6 }} />

            {/* Food photo */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: '100%', height: 70, background: '#243318', borderRadius: 4, marginBottom: 8, overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {foodPhoto
                ? <img src={foodPhoto} alt="food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#C8A042', fontSize: 9 }}>+ Click to add food photo</span>
              }
            </div>

            <E value={data.hours || ''} onChange={v => update({ hours: v })}
              style={{ fontSize: 9, color: '#243318', display: 'block', marginBottom: 6, fontWeight: 700 }} />

            <E value={data.address || ''} onChange={v => update({ address: v })}
              style={{ fontSize: 11, color: '#243318', display: 'block', fontWeight: 900, marginBottom: 6, lineHeight: 1.4 }} />

            <E value={data.phone || ''} onChange={v => update({ phone: v })}
              style={{ fontSize: 16, color: '#243318', display: 'block', fontWeight: 900, marginBottom: 4, fontFamily: 'serif' }} />

            <E value={data.website || ''} onChange={v => update({ website: v })}
              style={{ fontSize: 8, color: '#243318', display: 'block', marginBottom: 6 }} />

            {data.deliveryNote && (
              <E value={data.deliveryNote} onChange={v => update({ deliveryNote: v })}
                style={{ fontSize: 7.5, color: '#243318', display: 'block', marginBottom: 4, lineHeight: 1.4 }} />
            )}

            {data.allergyNote && (
              <div style={{ background: '#c00', padding: '3px 6px', borderRadius: 2, marginTop: 4 }}>
                <E value={data.allergyNote} onChange={v => update({ allergyNote: v })}
                  style={{ fontSize: 7.5, color: '#fff', display: 'block' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div style={{ textAlign: 'center', color: '#888', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>PAGE 2 — FULL MENU</div>
      <div style={{
        width: 960, margin: '0 auto', background: '#F4EFE3',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '16px 10px', borderRight: '1px solid #ddd' }}>
          {panelSections(6).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
        <div style={{ padding: '16px 10px', borderRight: '1px solid #ddd' }}>
          {panelSections(7).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
        <div style={{ padding: '16px 10px', borderRight: '1px solid #ddd' }}>
          {panelSections(8).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
        <div style={{ padding: '16px 10px' }}>
          {panelSections(9).map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
      </div>
    </div>
  )
}
