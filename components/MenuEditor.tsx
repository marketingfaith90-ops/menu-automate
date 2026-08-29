'use client'
import { useState, useRef } from 'react'
import { MenuData, MenuSection, MenuItem, SetMeal } from '@/lib/types'

interface Props {
  initialData: MenuData
  templateStyle: string
  onChange: (data: MenuData) => void
}

function E({ value, onChange, tag = 'span', style }: {
  value: string; onChange: (v: string) => void; tag?: string; style?: React.CSSProperties
}) {
  const Tag = tag as any
  return (
    <Tag contentEditable suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.currentTarget.textContent || '')}
      style={{ outline: 'none', cursor: 'text', ...style }}
      dangerouslySetInnerHTML={{ __html: value }} />
  )
}

const GREEN = '#2d4a1e'
const GOLD = '#b8a060'
const CREAM = '#f5f0e0'
const LIGHTBG = '#faf8f2'

export default function MenuEditor({ initialData, templateStyle, onChange }: Props) {
  const [data, setData] = useState<MenuData & { foodPhoto?: string }>({ ...initialData } as any)
  const logoRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<typeof data>) => {
    const next = { ...data, ...patch }
    setData(next)
    onChange(next as MenuData)
  }

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'foodPhoto') => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update({ [field]: ev.target?.result as string } as any)
    reader.readAsDataURL(file)
  }

  const updateSection = (id: string, patch: Partial<MenuSection>) =>
    update({ sections: data.sections.map(s => s.id === id ? { ...s, ...patch } : s) })

  const updateItem = (sid: string, iid: string, patch: Partial<MenuItem>) =>
    update({ sections: data.sections.map(s => s.id === sid ? { ...s, items: s.items.map(i => i.id === iid ? { ...i, ...patch } : i) } : s) })

  const addItem = (sid: string) =>
    update({ sections: data.sections.map(s => s.id === sid ? { ...s, items: [...s.items, { id: Date.now().toString(), name: 'New Item', price: '0.00' }] } : s) })

  const removeItem = (sid: string, iid: string) =>
    update({ sections: data.sections.map(s => s.id === sid ? { ...s, items: s.items.filter(i => i.id !== iid) } : s) })

  const updateMeal = (i: number, patch: Partial<SetMeal>) =>
    update({ setMeals: data.setMeals?.map((m, j) => j === i ? { ...m, ...patch } : m) })

  const sec = (panel: number) => data.sections.filter(s => s.panel === panel)

  const ItemRow = ({ s, item }: { s: MenuSection; item: MenuItem }) => (
    <div style={{ display: 'flex', borderBottom: '1px dotted #ccc', padding: '2px 0', gap: 4 }}>
      <div style={{ flex: 1 }}>
        <E value={item.name} onChange={v => updateItem(s.id, item.id, { name: v })}
          style={{ fontSize: 9, fontWeight: 600, color: GREEN, display: 'block' }} />
        {item.desc !== undefined && (
          <E value={item.desc || ''} onChange={v => updateItem(s.id, item.id, { desc: v })}
            style={{ fontSize: 7.5, color: '#777', fontStyle: 'italic', display: 'block' }} />
        )}
      </div>
      <E value={`£${item.price}`} onChange={v => updateItem(s.id, item.id, { price: v.replace('£','') })}
        style={{ fontSize: 9, fontWeight: 600, color: GREEN, whiteSpace: 'nowrap' }} />
      <span onClick={() => removeItem(s.id, item.id)} style={{ cursor: 'pointer', color: '#e33', fontSize: 11, lineHeight: '14px' }}>×</span>
    </div>
  )

  const Section = ({ s, headerBg = GREEN, headerColor = '#fff' }: { s: MenuSection; headerBg?: string; headerColor?: string }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ background: headerBg, color: headerColor, textAlign: 'center', padding: '3px 6px' }}>
        <E value={s.title} onChange={v => updateSection(s.id, { title: v })}
          style={{ fontWeight: 700, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', display: 'block' }} />
        {s.subtitle !== undefined && (
          <E value={s.subtitle || ''} onChange={v => updateSection(s.id, { subtitle: v })}
            style={{ fontStyle: 'italic', fontSize: 8, color: headerBg === GREEN ? '#c8d8a0' : '#555', display: 'block' }} />
        )}
      </div>
      {s.items.map(item => <ItemRow key={item.id} s={s} item={item} />)}
      <button onClick={() => addItem(s.id)}
        style={{ width: '100%', border: `1px dashed ${GOLD}`, background: 'transparent', color: GOLD, fontSize: 8, padding: '2px 0', cursor: 'pointer', marginTop: 3 }}>
        + ADD ITEM
      </button>
    </div>
  )

  const mealBoxIncludes = data.mealBox?.includes || ['Onion Baji','Mint Sauce','Bombay Potato','Pilau Rice','Curry of your choice']
  const setMeals = data.setMeals || []
  const fp = (data as any).foodPhoto

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#eee', padding: 12 }}>
      <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(e, 'logo')} />
      <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(e, 'foodPhoto')} />

      {/* ── PAGE 1 ── */}
      <div style={{ background: '#222', color: '#aaa', textAlign: 'center', fontSize: 10, padding: '4px 0', letterSpacing: 3, marginBottom: 2 }}>PAGE 1</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#fff', boxShadow: '0 2px 12px #0003' }}>

        {/* LEFT */}
        <div style={{ padding: '14px 12px', background: LIGHTBG, borderRight: `2px solid ${GREEN}` }}>
          {sec(1).map(s => <Section key={s.id} s={s} />)}
          {sec(1).length === 0 && <p style={{ color: '#bbb', fontSize: 10, textAlign: 'center' }}>Sections with panel=1</p>}
        </div>

        {/* MIDDLE */}
        <div style={{ padding: '14px 12px', background: LIGHTBG, borderRight: `2px solid ${GREEN}` }}>
          {sec(2).map(s => <Section key={s.id} s={s} />)}
          {sec(2).length === 0 && <p style={{ color: '#bbb', fontSize: 10, textAlign: 'center' }}>Sections with panel=2</p>}
        </div>

        {/* RIGHT — COVER PANEL */}
        <div style={{ background: CREAM, display: 'flex', flexDirection: 'column' }}>

          {/* MEAL BOX */}
          <div style={{ background: '#1a1a1a', color: '#fff', padding: '16px 14px' }}>
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>
                <E value={data.restaurantName} onChange={v => update({ restaurantName: v })}
                  style={{ color: '#fff', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 2 }} />
              </div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#c8d8a0', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>MEAL BOX</div>
              <div style={{ fontSize: 8, color: '#888', marginBottom: 2 }}>· COLLECTION ONLY ·</div>
              <div style={{ fontSize: 9, color: '#aaa' }}>ONLY</div>
              <E value={data.mealBox?.price || '£11.99'}
                onChange={v => update({ mealBox: { ...(data.mealBox || { title:'', subtitle:'', includes:[] }), price: v } })}
                style={{ fontSize: 32, fontWeight: 900, color: '#f0c040', display: 'block', lineHeight: 1 }} />
            </div>
            <div style={{ borderTop: '1px solid #444', paddingTop: 8 }}>
              {mealBoxIncludes.map((inc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ color: GOLD, fontSize: 8 }}>◆</span>
                  <E value={inc} onChange={v => {
                    const arr = [...mealBoxIncludes]; arr[i] = v
                    update({ mealBox: { ...(data.mealBox || { title:'', subtitle:'', price:'£11.99' }), includes: arr } })
                  }} style={{ color: '#c8d8a0', fontSize: 9 }} />
                </div>
              ))}
            </div>
          </div>

          {/* SET MEALS */}
          <div style={{ padding: '10px 14px', background: CREAM, borderBottom: `1px solid #ddd` }}>
            <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: 16, color: GREEN, fontStyle: 'italic', marginBottom: 2 }}>Special Set Meals</div>
            <div style={{ textAlign: 'center', fontSize: 8, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 8 }}>CHEFS RECOMMENDATIONS</div>
            {setMeals.map((meal, i) => (
              <div key={meal.id} style={{ background: GOLD, borderRadius: 3, padding: '8px 10px', marginBottom: 6 }}>
                <E value={meal.heading} onChange={v => updateMeal(i, { heading: v })}
                  style={{ display: 'block', color: '#fff', fontWeight: 700, fontSize: 10, marginBottom: 2 }} />
                <E value={meal.price} onChange={v => updateMeal(i, { price: v })}
                  style={{ display: 'block', color: '#fff', fontWeight: 900, fontSize: 22 }} />
                <E value={meal.body} onChange={v => updateMeal(i, { body: v })}
                  style={{ display: 'block', color: '#f5f0d0', fontSize: 7.5, marginTop: 4, lineHeight: 1.5 }} />
              </div>
            ))}
          </div>

          {/* LOGO + INFO */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 14px 10px', gap: 8, background: CREAM }}>

            {/* Logo upload */}
            <div onClick={() => logoRef.current?.click()}
              style={{ cursor: 'pointer', width: '100%', minHeight: 70, border: `2px dashed ${GOLD}`, borderRadius: 4, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data.logo
                ? <img src={data.logo} style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }} alt="logo" />
                : <div style={{ textAlign: 'center', color: GOLD, fontSize: 9 }}><div style={{ fontSize: 24 }}>🏪</div>Click to upload LOGO</div>}
            </div>

            {/* Hygiene rating */}
            {data.hygiene && (
              <div style={{ border: `2px solid ${GREEN}`, padding: '4px 10px', textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: 1, textTransform: 'uppercase' }}>FOOD HYGIENE RATING</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '3px 0' }}>
                  {[0,1,2,3,4].map(n => <span key={n} style={{ width: 14, height: 14, border: `1px solid ${GREEN}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>{n}</span>)}
                </div>
                <E value={data.hygiene} onChange={v => update({ hygiene: v })}
                  style={{ fontSize: 22, fontWeight: 900, color: GREEN, display: 'block', lineHeight: 1 }} />
                <div style={{ fontSize: 7, color: '#999' }}>VERY GOOD</div>
              </div>
            )}

            {/* Food photo */}
            <div onClick={() => photoRef.current?.click()}
              style={{ cursor: 'pointer', width: '100%', height: 130, border: `2px dashed ${GOLD}`, borderRadius: 4, overflow: 'hidden', background: '#e0d8c8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {fp
                ? <img src={fp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="food" />
                : <div style={{ textAlign: 'center', color: GOLD, fontSize: 9 }}><div style={{ fontSize: 30 }}>🍛</div>Click to upload food photo</div>}
            </div>

            {/* Hours */}
            <E value={data.hours || 'OPEN 6 DAYS A WEEK\n5PM - LATE\nCLOSED TUESDAY'}
              onChange={v => update({ hours: v })} tag="div"
              style={{ fontWeight: 700, fontSize: 11, textAlign: 'center', color: GREEN, textTransform: 'uppercase', lineHeight: 1.5, whiteSpace: 'pre-line' }} />

            {/* Address — BIG */}
            <E value={data.address || '179 HAMPTON LANE,\nSOUTHAMPTON,\nSO45 1XA'}
              onChange={v => update({ address: v })} tag="div"
              style={{ fontWeight: 900, fontSize: 18, textAlign: 'center', color: '#111', lineHeight: 1.2, textTransform: 'uppercase', whiteSpace: 'pre-line' }} />

            {/* Delivery note */}
            <E value={data.deliveryNote || 'DELIVERY SERVICE AVAILABLE ON ORDERS OVER £13.00'}
              onChange={v => update({ deliveryNote: v })} tag="div"
              style={{ fontSize: 8.5, textAlign: 'center', color: '#555', lineHeight: 1.5 }} />

            {/* Phone — HUGE */}
            <E value={data.phone || '02380 891 870'}
              onChange={v => update({ phone: v })} tag="div"
              style={{ fontWeight: 900, fontSize: 24, textAlign: 'center', color: '#111', letterSpacing: 1 }} />

            {/* Website */}
            <E value={data.website || 'www.yourwebsite.co.uk'}
              onChange={v => update({ website: v })} tag="div"
              style={{ fontSize: 9, textAlign: 'center', color: GREEN, fontWeight: 600 }} />

            {/* Special note */}
            <div style={{ textAlign: 'center', fontSize: 9, color: GREEN, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.5 }}>
              WE WILL BE PLEASED TO COOK ANY TRADITIONAL FOOD ON REQUEST
            </div>

            {/* Allergy */}
            <div style={{ background: '#d42020', color: '#fff', padding: '5px 8px', width: '100%', textAlign: 'center', borderRadius: 2 }}>
              <E value={data.allergyNote || 'If you have any food allergies please inform us when ordering'}
                onChange={v => update({ allergyNote: v })}
                style={{ fontSize: 8.5, color: '#fff', display: 'block' }} />
            </div>

            {/* Footer note */}
            <div style={{ fontSize: 7.5, color: '#999', textAlign: 'center', lineHeight: 1.4 }}>
              The management reserves the right to refuse service without any explanation
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE 2 ── */}
      <div style={{ background: '#222', color: '#aaa', textAlign: 'center', fontSize: 10, padding: '4px 0', letterSpacing: 3, marginTop: 16, marginBottom: 2 }}>PAGE 2</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: '#fff', boxShadow: '0 2px 12px #0003' }}>
        {[3, 4, 5, 6].map((panel, idx) => (
          <div key={panel} style={{ padding: '14px 10px', background: LIGHTBG, borderRight: idx < 3 ? `2px solid ${GREEN}` : undefined }}>
            {sec(panel).map(s => <Section key={s.id} s={s} />)}
            {sec(panel).length === 0 && <p style={{ color: '#bbb', fontSize: 9, textAlign: 'center' }}>Sections with panel={panel}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
