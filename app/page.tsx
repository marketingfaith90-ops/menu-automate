'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Template } from '@/lib/types'
import Link from 'next/link'

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        setTemplates(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#0C0C0C]">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <span className="font-cinzel text-xl font-bold text-[#C8A042] tracking-wider">
          Menu<span className="text-white">Automate</span>
        </span>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#templates" className="hover:text-[#C8A042] transition-colors">Templates</a>
          <a href="#how" className="hover:text-[#C8A042] transition-colors">How It Works</a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="px-8 pt-24 pb-20 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#C8A042]/10 border border-[#C8A042]/30 text-[#C8A042] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          Professional Restaurant Menus
        </div>
        <h1 className="font-cinzel text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your Menu.<br />
          <span className="text-[#C8A042]">Any Business.</span><br />
          Minutes.
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Choose a professional template, enter your restaurant&apos;s details and menu items,
          then save and download a print-ready PDF — no design skills needed.
        </p>
        <a
          href="#templates"
          className="inline-block bg-[#C8A042] text-[#0C0C0C] font-bold text-sm tracking-widest uppercase px-10 py-4 rounded hover:bg-[#DDB85A] transition-colors"
        >
          Browse Templates →
        </a>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how" className="border-y border-white/10 py-16 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Pick a Template', desc: 'Browse our library of professionally designed restaurant menu layouts.' },
            { n: '02', title: 'Enter Your Details', desc: 'Add your restaurant name, address, phone number, and all your menu items.' },
            { n: '03', title: 'Save & Download', desc: 'Your menu is saved online and ready to download as a print-ready PDF.' },
          ].map(s => (
            <div key={s.n} className="flex flex-col gap-3">
              <span className="font-cinzel text-4xl font-bold text-[#C8A042]/30">{s.n}</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEMPLATE GALLERY ────────────────────────── */}
      <section id="templates" className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-3xl font-bold text-white mb-3">Choose a Template</h2>
          <p className="text-white/50 text-sm">Select a layout and it becomes the foundation for your new menu</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40">Loading templates…</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="mb-2">No templates found.</p>
            <p className="text-xs">Make sure you&apos;ve run the SQL schema in Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(t => (
              <TemplateCard key={t.id} template={t} />
            ))}

            {/* Coming Soon card */}
            <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[280px]">
              <div className="text-3xl">✦</div>
              <p className="font-cinzel text-sm font-bold text-white/40 uppercase tracking-widest">More Coming Soon</p>
              <p className="text-white/30 text-xs">Pizza, Chinese, Burger & more layouts in progress</p>
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-8 text-center text-white/30 text-xs">
        <span className="font-cinzel text-[#C8A042]">MenuAutomate</span> — Built for design departments that produce menus at scale.
      </footer>
    </div>
  )
}

function TemplateCard({ template }: { template: Template }) {
  const colors = template.color_scheme as Record<string, string>

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#C8A042]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#C8A042]/10">

      {/* Preview thumbnail */}
      <div
        className="h-48 relative flex items-center justify-center"
        style={{ background: colors?.bg ?? '#F4EFE3' }}
      >
        {/* Mini menu preview */}
        <div className="w-4/5 h-36 rounded shadow-lg overflow-hidden flex">
          <div className="flex-1 flex flex-col gap-1 p-2" style={{ background: colors?.bg ?? '#F4EFE3' }}>
            <div className="h-3 rounded-sm w-full" style={{ background: colors?.primary ?? '#243318' }} />
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex-1 h-1.5 rounded-full bg-black/10" />
                <div className="w-6 h-1.5 rounded-full" style={{ background: colors?.accent ?? '#C8A042', opacity: 0.6 }} />
              </div>
            ))}
            <div className="h-3 rounded-sm w-full mt-1" style={{ background: colors?.primary ?? '#243318' }} />
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex-1 h-1.5 rounded-full bg-black/10" />
                <div className="w-5 h-1.5 rounded-full" style={{ background: colors?.accent ?? '#C8A042', opacity: 0.6 }} />
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1 p-2" style={{ background: colors?.bg ?? '#F4EFE3' }}>
            <div className="h-3 rounded-sm w-full" style={{ background: colors?.primary ?? '#243318' }} />
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-1">
                <div className="flex-1 h-1.5 rounded-full bg-black/10" />
                <div className="w-5 h-1.5 rounded-full" style={{ background: colors?.accent ?? '#C8A042', opacity: 0.6 }} />
              </div>
            ))}
          </div>
          <div
            className="w-20 flex flex-col p-2 gap-2"
            style={{ background: colors?.primary ?? '#243318' }}
          >
            <div className="h-2.5 rounded-sm w-full" style={{ background: colors?.accent ?? '#C8A042', opacity: 0.6 }} />
            <div className="flex-1 rounded" style={{ background: colors?.accent ?? '#C8A042', opacity: 0.15 }} />
            <div className="h-2 rounded-sm w-full bg-white/20" />
            <div className="h-1.5 w-3/4 rounded-sm bg-white/10" />
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-5">
        <h3 className="font-cinzel text-base font-bold text-white mb-1">{template.name}</h3>
        <p className="text-white/50 text-xs leading-relaxed mb-5">{template.description}</p>
        <Link
          href={`/create/${template.id}`}
          className="block w-full text-center bg-[#C8A042] text-[#0C0C0C] font-bold text-xs tracking-widest uppercase py-3 rounded hover:bg-[#DDB85A] transition-colors"
        >
          Use This Template →
        </Link>
      </div>
    </div>
  )
}
