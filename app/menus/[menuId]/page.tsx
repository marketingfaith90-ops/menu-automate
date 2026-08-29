'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Menu, MenuData, MenuSection, MenuItem, SetMeal } from '@/lib/types'
import MenuEditor from '@/components/MenuEditor'

export default function MenuPage() {
  const { menuId } = useParams<{ menuId: string }>()
  const router = useRouter()

  const [menu, setMenu]         = useState<Menu | null>(null)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [saving, setSaving]     = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('menus')
      .select('*, templates(style)')
      .eq('id', menuId)
      .single()
      .then(({ data }) => {
        if (data) {
          setMenu(data as Menu)
          setMenuData(data.menu_data as MenuData)
        }
        setLoading(false)
      })
  }, [menuId])

  const handleSave = async (data: MenuData) => {
    setSaving(true)
    await supabase
      .from('menus')
      .update({
        menu_data:     data as unknown as Record<string,unknown>,
        business_name: data.restaurantName,
      })
      .eq('id', menuId)
    setSaving(false)
    setSaveMsg('✓ Saved')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-white/40">
      Loading menu…
    </div>
  )
  if (!menu || !menuData) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-white/40">
      Menu not found.
    </div>
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const templateStyle = (menu as any).templates?.style ?? 'indian-classic'

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="sticky top-0 z-50 bg-[#111] border-b border-white/10 px-6 py-3 flex items-center gap-4 no-print">
        <button onClick={() => router.push('/')} className="text-white/50 hover:text-white text-sm transition-colors">
          ← Templates
        </button>
        <span className="text-white/20">|</span>
        <span className="font-cinzel text-sm font-bold text-[#C8A042]">{menu.business_name}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/40 text-xs italic">Click any text to edit</span>
          {saveMsg && <span className="text-emerald-400 text-xs font-bold">{saveMsg}</span>}
          <button
            onClick={() => window.print()}
            className="border border-white/20 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
          >
            🖨 Print / PDF
          </button>
          <button
            onClick={() => handleSave(menuData)}
            disabled={saving}
            className="bg-[#C8A042] text-[#0C0C0C] font-bold text-xs uppercase tracking-wider px-5 py-2 rounded hover:bg-[#DDB85A] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Menu'}
          </button>
        </div>
      </div>

      <MenuEditor
        templateStyle={templateStyle}
        initialData={menuData}
        onChange={setMenuData}
      />
    </div>
  )
}
