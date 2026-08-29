'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Template, MenuData } from '@/lib/types'
import BusinessSetupModal from '@/components/BusinessSetupModal'
import MenuEditor from '@/components/MenuEditor'

export default function CreatePage() {
  const { templateId } = useParams<{ templateId: string }>()
  const router = useRouter()

  const [template, setTemplate]       = useState<Template | null>(null)
  const [menuData, setMenuData]       = useState<MenuData | null>(null)
  const [showModal, setShowModal]     = useState(true)
  const [saving, setSaving]           = useState(false)
  const [savedMenuId, setSavedMenuId] = useState<string | null>(null)
  const [saveMsg, setSaveMsg]         = useState('')

  useEffect(() => {
    supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()
      .then(({ data }) => {
        if (data) setTemplate(data)
      })
  }, [templateId])

  // Called when the user fills in business info
  const handleSetup = (info: {
    businessName: string
    tagline: string
    phone: string
    website: string
    address: string
    hours: string
  }) => {
    if (!template) return
    // Clone template defaults and inject business info
    const base = { ...(template.default_data as MenuData) }
    const filled: MenuData = {
      ...base,
      restaurantName: info.businessName,
      tagline:        info.tagline,
      phone:          info.phone,
      website:        info.website,
      address:        info.address,
      hours:          info.hours,
    }
    setMenuData(filled)
    setShowModal(false)
  }

  const handleSave = async (data: MenuData) => {
    if (!template) return
    setSaving(true)
    setSaveMsg('')

    if (savedMenuId) {
      // Update existing
      await supabase
        .from('menus')
        .update({ menu_data: data as unknown as Record<string,unknown>, business_name: data.restaurantName })
        .eq('id', savedMenuId)
      setSaveMsg('✓ Saved')
    } else {
      // Create new
      const { data: row, error } = await supabase
        .from('menus')
        .insert({
          template_id:   template.id,
          business_name: data.restaurantName,
          menu_data:     data as unknown as Record<string,unknown>,
          is_published:  false,
        })
        .select('id')
        .single()

      if (!error && row) {
        setSavedMenuId(row.id)
        setSaveMsg('✓ Saved')
        // Update URL without reload
        window.history.replaceState({}, '', `/menus/${row.id}`)
      }
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-white/40">
        Loading template…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111]">

      {/* ── TOP BAR ───────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#111] border-b border-white/10 px-6 py-3 flex items-center gap-4 no-print">
        <button
          onClick={() => router.push('/')}
          className="text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Templates
        </button>
        <span className="text-white/20">|</span>
        <span className="font-cinzel text-sm font-bold text-[#C8A042]">
          {template.name}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/40 text-xs italic">Click any text on the menu to edit it</span>
          {saveMsg && (
            <span className="text-emerald-400 text-xs font-bold">{saveMsg}</span>
          )}
          {menuData && (
            <>
              <button
                onClick={() => window.print()}
                className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
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
            </>
          )}
        </div>
      </div>

      {/* ── BUSINESS SETUP MODAL ──────────────────── */}
      {showModal && (
        <BusinessSetupModal
          templateName={template.name}
          onConfirm={handleSetup}
          onCancel={() => router.push('/')}
        />
      )}

      {/* ── MENU EDITOR ───────────────────────────── */}
      {menuData && (
        <MenuEditor
          templateStyle={template.style}
          initialData={menuData}
          onChange={setMenuData}
        />
      )}
    </div>
  )
}
