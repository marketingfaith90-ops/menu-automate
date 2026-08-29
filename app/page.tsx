'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MenuData, Template } from '@/lib/types'
import BusinessSetupModal from '@/components/BusinessSetupModal'
import MenuEditor from '@/components/MenuEditor'

export default function CreatePage() {
  const { templateId } = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [showModal, setShowModal] = useState(true)
  const [savedMenuId, setSavedMenuId] = useState<string | null>(null)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()
      .then(({ data }) => {
        if (data) setTemplate(data as Template)
      })
  }, [templateId])

  const handleSetup = (data: MenuData) => {
    setMenuData(data)
    setShowModal(false)
  }

  const handleSave = async () => {
    if (!menuData || !template) return
    setSaveMsg('Saving...')
    if (savedMenuId) {
      await (supabase
        .from('menus')
        .update({ menu_data: menuData as any, business_name: menuData.restaurantName }) as any)
        .eq('id', savedMenuId)
      setSaveMsg('✓ Saved')
    } else {
      const { data, error } = await supabase
        .from('menus')
        .insert({
          template_id: template.id,
          business_name: menuData.restaurantName,
          menu_data: menuData as any,
        })
        .select()
        .single()
      if (!error && data) {
        setSavedMenuId((data as any).id)
        setSaveMsg('✓ Saved')
      }
    }
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handlePrint = () => window.print()

  if (!template) return <div className="flex items-center justify-center h-screen">Loading template...</div>

  return (
    <div>
      {showModal && (
        <BusinessSetupModal
          defaultData={template.default_data as unknown as MenuData}
          onConfirm={handleSetup}
        />
      )}
      {menuData && (
        <>
          <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              {saveMsg && <span className="text-green-600 text-sm font-medium">{saveMsg}</span>}
              <button
                onClick={handleSave}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700"
              >
                Save Menu
              </button>
              <button
                onClick={handlePrint}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900"
              >
                Download PDF
              </button>
            </div>
          </div>
          <div className="pt-16">
            <MenuEditor
              initialData={menuData}
              templateStyle={template.style}
              onChange={setMenuData}
            />
          </div>
        </>
      )}
    </div>
  )
}
