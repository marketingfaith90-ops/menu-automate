'use client'

import { useState, useCallback } from 'react'
import type { MenuData, MenuSection, MenuItem, SetMeal } from '@/lib/types'

interface Props {
  templateStyle: string
  initialData: MenuData
  onChange: (data: MenuData) => void
}

export default function MenuEditor({ templateStyle, initialData, onChange }: Props) {
  const [data, setData] = useState<MenuData>(initialData)

  const update = useCallback((patch: Partial<MenuData>) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange(next)
      return next
    })
  }, [onChange])

  const updateSection = (sectionId: string, patch: Partial<MenuSection>) => {
    const sections = data.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s)
    update({ sections })
  }

  const addItem = (sectionId: string) => {
    const sections = data.sections.map(s => {
      if (s.id !== sectionId) return s
      const newItem: MenuItem = { id: `i${Date.now()}`, name: 'New Item', price: '£0.00', desc: '' }
      return { ...s, items: [...s.items, newItem] }
    })
    update({ sections })
  }

  const updateItem = (sectionId: string, itemId: string, patch: Partial<MenuItem>) => {
    const sections = data.sections.map(s => {
      if (s.id !== sectionId) return s
      return { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } : i) }
    })
    update({ sections })
  }

  const removeItem = (sectionId: string, itemId: string) => {
    const sections = data.sections.map(s => {
      if (s.id !== sectionId) return s
      return { ...s, items: s.items.filter(i => i.id !== itemId) }
    })
    update({ sections })
  }

  const addSection = (panel: number) => {
    const newSec: MenuSection = {
      id: `sec${Date.now()}`,
      title: 'New Section',
      subtitle: '',
      panel,
      items: [{ id: `i${Date.now()}`, name: 'Item Name', price: '£0.00', desc: '' }]
    }
    update({ sections: [...data.sections, newSec] })
  }

  const removeSection = (sectionId: string) => {
    update({ sections: data.sections.filter(s => s.id !== sectionId) })
  }

  const updateSetMeal = (id: string, patch: Partial<SetMeal>) => {
    const setMeals = data.setMeals.map(m => m.id === id ? { ...m, ...patch } : m)
    update({ setMeals })
  }

  const addSetMeal = () => {
    const m: SetMeal = { id: `sm${Date.now()}`, heading: 'New Set Meal', price: '£0.00', body: 'Describe the meal…' }
    update({ setMeals: [...data.setMeals, m] })
  }

  const removeSetMeal = (id: string) => {
    update({ setMeals: data.setMeals.filter(m => m.id !== id) })
  }

  // Template router — add more styles here later
  if (templateStyle === 'indian-classic') {
    return (
      <IndianClassicLayout
        data={data}
        onInfo={update}
        onUpdateSection={updateSection}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onAddSection={addSection}
        onRemoveSection={removeSection}
        onUpdateSetMeal={updateSetMeal}
        onAddSetMeal={addSetMeal}
        onRemoveSetMeal={removeSetMeal}
      />
    )
  }

  return <div className="p-20 text-center text-white/40">Template style "{templateStyle}" not yet implemented.</div>
}

// ─────────────────────────────────────────────────────────────
//  INDIAN CLASSIC LAYOUT
// ─────────────────────────────────────────────────────────────

interface LayoutProps {
  data: MenuData
  onInfo: (patch: Partial<MenuData>) => void
  onUpdateSection: (id: string, patch: Partial<MenuSection>) => void
  onAddItem: (sectionId: string) => void
  onUpdateItem: (sectionId: string, itemId: string, patch: Partial<MenuItem>) => void
  onRemoveItem: (sectionId: string, itemId: string) => void
  onAddSection: (panel: number) => void
  onRemoveSection: (id: string) => void
  onUpdateSetMeal: (id: string, patch: Partial<SetMeal>) => void
  onAddSetMeal: () => void
  onRemoveSetMeal: (id: string) => void
}

function IndianClassicLayout(p: LayoutProps) {
  const { data } = p
  const byPanel = (n: number) => data.sections.filter(s => s.panel === n)

  return (
    <div id="print-target" className="flex flex-col gap-0 p-8 print:p-0">

      {/* ════ PAGE 1 ════ */}
      <PageShell label="Page 1 — Cover / Back">
        <div className="grid grid-cols-[300px_310px_1fr] min-h-[860px]">

          {/* Panel 1 */}
          <Panel borderRight>
            {byPanel(1).map(s => (
              <SectionBlock key={s.id} section={s} {...p} />
            ))}
            <AddSectionBtn onClick={() => p.onAddSection(1)} />
          </Panel>

          {/* Panel 2 */}
          <Panel borderRight>
            {byPanel(2).map(s => (
              <SectionBlock key={s.id} section={s} {...p} />
            ))}
            <AddSectionBtn onClick={() => p.onAddSection(2)} />
          </Panel>

          {/* Panel 3 — Info / Promo */}
          <div className="flex flex-col" style={{ background: '#FAF7F0' }}>

            {/* Meal Box */}
            <div className="p-5" style={{ background: '#1E2E12' }}>
              <E
                className="font-cinzel text-2xl font-bold text-center block leading-tight"
                style={{ color: '#C8A042' }}
                value={data.mealBox.title}
                onSave={v => p.onInfo({ mealBox: { ...data.mealBox, title: v } })}
              />
              <E
                className="font-cinzel text-xs tracking-widest text-center block mt-1"
                style={{ color: '#DDB85A' }}
                value={data.mealBox.subtitle}
                onSave={v => p.onInfo({ mealBox: { ...data.mealBox, subtitle: v } })}
              />
              <div className="text-center mt-3">
                <span className="text-[11px] text-white/50 uppercase tracking-widest">Only</span>
                <E
                  className="font-lato text-3xl font-black block"
                  style={{ color: '#fff' }}
                  value={data.mealBox.price}
                  onSave={v => p.onInfo({ mealBox: { ...data.mealBox, price: v } })}
                />
              </div>
              <ul className="mt-3 space-y-1">
                {data.mealBox.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-white/70">
                    <span style={{ color: '#C8A042' }}>✦</span>
                    <E
                      className="flex-1 text-[10px]"
                      style={{ color: '#ccc' }}
                      value={inc}
                      onSave={v => {
                        const includes = [...data.mealBox.includes]
                        includes[i] = v
                        p.onInfo({ mealBox: { ...data.mealBox, includes } })
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Set Meals */}
            <div className="p-5" style={{ background: '#EDE5CE' }}>
              <E
                className="font-dancing text-2xl font-bold text-center block"
                style={{ color: '#243318' }}
                value="Special Set Meals"
                onSave={() => {}}
              />
              <E
                className="font-cinzel text-[9px] tracking-widest text-center block uppercase mb-3"
                style={{ color: '#7A6B56' }}
                value="Chefs Recommendations"
                onSave={() => {}}
              />
              {data.setMeals.map(meal => (
                <div key={meal.id} className="relative mb-3 rounded p-3" style={{ background: '#C8A042' }}>
                  <button
                    onClick={() => p.onRemoveSetMeal(meal.id)}
                    className="no-print absolute top-1 right-1 text-[8px] bg-red-700 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 hover:opacity-100"
                    title="Remove"
                  >✕</button>
                  <E
                    className="font-cinzel text-[10px] font-bold text-center block uppercase tracking-wider"
                    style={{ color: '#2A1A0E' }}
                    value={meal.heading}
                    onSave={v => p.onUpdateSetMeal(meal.id, { heading: v })}
                  />
                  <E
                    className="font-lato text-xl font-black text-center block"
                    style={{ color: '#2A1A0E' }}
                    value={meal.price}
                    onSave={v => p.onUpdateSetMeal(meal.id, { price: v })}
                  />
                  <E
                    className="font-lato text-[8px] text-center block mt-1 whitespace-pre-line"
                    style={{ color: '#2A1A0E' }}
                    value={meal.body}
                    onSave={v => p.onUpdateSetMeal(meal.id, { body: v })}
                    multiline
                  />
                </div>
              ))}
              <button
                onClick={p.onAddSetMeal}
                className="no-print block w-full border border-dashed text-[8px] font-bold uppercase tracking-widest py-1.5 rounded mt-1 transition-colors"
                style={{ borderColor: '#C8A042', color: '#C8A042' }}
              >＋ Add Set Meal</button>
            </div>

            {/* Restaurant Info */}
            <div className="flex-1 p-5 flex flex-col">
              <div className="text-center mb-3">
                <E
                  className="font-cinzel text-4xl font-black inline-block"
                  style={{ color: '#243318' }}
                  value={data.restaurantName}
                  onSave={v => p.onInfo({ restaurantName: v })}
                />
                <E
                  className="font-cinzel text-xs tracking-widest block uppercase mt-1"
                  style={{ color: '#243318' }}
                  value={data.tagline}
                  onSave={v => p.onInfo({ tagline: v })}
                />
              </div>

              <div className="border-2 border-[#2A1A0E] p-2 mx-auto mb-3 text-center" style={{ width: 'fit-content' }}>
                <div className="text-[8px] font-bold tracking-widest uppercase mb-1" style={{ color: '#2A1A0E' }}>Food Hygiene Rating</div>
                <div className="flex gap-1 justify-center">
                  {[1,2,3,4,5].map(n => (
                    <div
                      key={n}
                      onClick={() => p.onInfo({ hygiene: n })}
                      className="w-5 h-5 border border-[#2A1A0E] flex items-center justify-center text-[9px] cursor-pointer transition-colors"
                      style={{ background: n <= data.hygiene ? '#2A1A0E' : 'transparent', color: n <= data.hygiene ? '#F4EFE3' : '#2A1A0E' }}
                    >
                      {n === 5 ? n : ''}
                    </div>
                  ))}
                </div>
              </div>

              <E
                className="font-lato text-xs text-center block leading-loose whitespace-pre-line font-bold"
                style={{ color: '#2A1A0E' }}
                value={data.hours}
                onSave={v => p.onInfo({ hours: v })}
                multiline
              />

              <E
                className="font-lato text-sm font-black text-center block leading-snug uppercase mt-3 mb-2 p-3 border-2 whitespace-pre-line"
                style={{ color: '#2A1A0E', borderColor: '#2A1A0E' }}
                value={data.address}
                onSave={v => p.onInfo({ address: v })}
                multiline
              />

              <E
                className="font-lato text-[9px] text-center block leading-relaxed"
                style={{ color: '#2A1A0E' }}
                value={data.deliveryNote}
                onSave={v => p.onInfo({ deliveryNote: v })}
              />

              <E
                className="font-lato text-3xl font-black text-center block my-2"
                style={{ color: '#2A1A0E' }}
                value={data.phone}
                onSave={v => p.onInfo({ phone: v })}
              />

              <E
                className="font-lato text-xs text-center block"
                style={{ color: '#3A5227' }}
                value={data.website}
                onSave={v => p.onInfo({ website: v })}
              />

              <div
                className="mt-auto text-center py-2 px-3"
                style={{ background: '#8C1C13' }}
              >
                <E
                  className="font-lato text-[9px] text-white block"
                  value={data.allergyNote}
                  onSave={v => p.onInfo({ allergyNote: v })}
                />
              </div>
            </div>
          </div>

        </div>
      </PageShell>

      {/* ════ PAGE 2 ════ */}
      <PageShell label="Page 2 — Full Menu Spread">
        <div className="grid grid-cols-4 min-h-[920px]">
          {[4, 5, 6, 7].map((panelN, idx) => (
            <Panel key={panelN} borderRight={idx < 3}>
              {byPanel(panelN).map(s => (
                <SectionBlock key={s.id} section={s} {...p} />
              ))}
              <AddSectionBtn onClick={() => p.onAddSection(panelN)} />
            </Panel>
          ))}
        </div>
      </PageShell>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SECTION BLOCK
// ─────────────────────────────────────────────────────────────
function SectionBlock({
  section,
  onUpdateSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onRemoveSection,
}: {
  section: MenuSection
} & Pick<LayoutProps, 'onUpdateSection'|'onAddItem'|'onUpdateItem'|'onRemoveItem'|'onRemoveSection'>) {

  return (
    <div className="mb-3 relative group/section">

      {/* Section delete */}
      <button
        onClick={() => onRemoveSection(section.id)}
        className="no-print absolute top-0 right-0 z-10 text-[7px] bg-red-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/section:opacity-100 transition-opacity"
        title="Delete section"
      >✕</button>

      {/* Title */}
      <E
        className="font-cinzel text-[11px] font-bold tracking-wider text-center block uppercase py-1 px-2 mb-0.5"
        style={{ background: '#243318', color: '#F4EFE3' }}
        value={section.title}
        onSave={v => onUpdateSection(section.id, { title: v })}
      />

      {/* Subtitle */}
      {(section.subtitle !== undefined) && (
        <E
          className="font-lato text-[7.5px] italic text-center block mb-1"
          style={{ color: '#7A6B56' }}
          value={section.subtitle ?? ''}
          onSave={v => onUpdateSection(section.id, { subtitle: v })}
          placeholder="Add subtitle…"
        />
      )}

      <div className="border-t mb-1" style={{ borderColor: '#C8A042' }} />

      {/* Items */}
      {section.items.map(item => (
        <ItemRow
          key={item.id}
          item={item}
          onUpdate={patch => onUpdateItem(section.id, item.id, patch)}
          onRemove={() => onRemoveItem(section.id, item.id)}
        />
      ))}

      {/* Add item */}
      <button
        onClick={() => onAddItem(section.id)}
        className="no-print block w-full border border-dashed text-[7.5px] font-bold uppercase tracking-widest py-1 rounded mt-1 transition-colors"
        style={{ borderColor: '#C8B88A', color: '#8A7A65' }}
      >＋ Add Item</button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ITEM ROW
// ─────────────────────────────────────────────────────────────
function ItemRow({ item, onUpdate, onRemove }: {
  item: MenuItem
  onUpdate: (patch: Partial<MenuItem>) => void
  onRemove: () => void
}) {
  return (
    <div className="group/item">
      <div className="flex items-baseline gap-1 py-px">
        <E
          className="font-lato text-[8.5px] font-bold uppercase tracking-wider flex-1"
          style={{ color: '#2A1A0E' }}
          value={item.name}
          onSave={v => onUpdate({ name: v })}
        />
        <div className="flex-1 border-b border-dotted" style={{ borderColor: '#7A6B56', position: 'relative', top: '-2px' }} />
        <E
          className="font-lato text-[8.5px] font-bold font-variant-numeric whitespace-nowrap"
          style={{ color: '#2A1A0E' }}
          value={item.price}
          onSave={v => onUpdate({ price: v })}
        />
        <button
          onClick={onRemove}
          className="no-print text-[7px] bg-red-800 text-white px-1 py-px rounded opacity-0 group-hover/item:opacity-100 transition-opacity ml-1"
        >✕</button>
      </div>
      {item.desc && (
        <E
          className="font-lato text-[7px] italic block -mt-px mb-0.5"
          style={{ color: '#7A6B56' }}
          value={item.desc}
          onSave={v => onUpdate({ desc: v })}
          placeholder="Description…"
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  EDITABLE INLINE ELEMENT
// ─────────────────────────────────────────────────────────────
function E({
  value,
  onSave,
  className = '',
  style,
  placeholder,
  multiline,
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  multiline?: boolean
}) {
  const Tag = multiline ? 'div' : 'span'
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onSave(e.currentTarget.textContent ?? '')}
      className={`${className} outline-none cursor-text focus:ring-1 focus:ring-[#C8A042]/50 focus:rounded-sm`}
      style={style}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function Panel({ children, borderRight }: { children: React.ReactNode; borderRight?: boolean }) {
  return (
    <div
      className="p-4 flex flex-col"
      style={{
        background: '#F4EFE3',
        borderRight: borderRight ? '1px solid #C8B88A' : undefined,
      }}
    >
      {children}
    </div>
  )
}

function PageShell({ label, children }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mb-10">
      <div className="no-print text-center text-[10px] tracking-widest uppercase font-bold text-white/30 py-2">
        {label}
      </div>
      <div className="shadow-2xl" style={{ width: '1190px', maxWidth: '100%', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}

function AddSectionBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="no-print block w-full border border-dashed text-[8px] font-bold uppercase tracking-widest py-2 rounded mt-2 transition-colors"
      style={{ borderColor: '#8A7A65', color: '#8A7A65' }}
    >＋ Add Section</button>
  )
}
