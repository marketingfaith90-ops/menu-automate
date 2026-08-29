'use client'

import { useState } from 'react'

interface Props {
  templateName: string
  onConfirm: (info: {
    businessName: string
    tagline: string
    phone: string
    website: string
    address: string
    hours: string
  }) => void
  onCancel: () => void
}

export default function BusinessSetupModal({ templateName, onConfirm, onCancel }: Props) {
  const [form, setForm] = useState({
    businessName: '',
    tagline:      'Indian Takeaway',
    phone:        '',
    website:      '',
    address:      '',
    hours:        'Open 7 Days a Week\n5PM – Late',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const valid = form.businessName.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161616] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/10">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C8A042] mb-2">
            Using: {templateName}
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white leading-tight">
            Set Up Your<br />Business Details
          </h2>
          <p className="text-white/50 text-sm mt-2">
            These fill your menu automatically. You can edit any of them directly on the menu afterwards.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 flex flex-col gap-4">

          <Field label="Restaurant / Business Name *" required>
            <input
              type="text"
              placeholder="e.g. Spice Garden"
              value={form.businessName}
              onChange={set('businessName')}
              autoFocus
              className={inputCls}
            />
          </Field>

          <Field label="Tagline">
            <input
              type="text"
              placeholder="e.g. Indian Takeaway"
              value={form.tagline}
              onChange={set('tagline')}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number">
              <input
                type="text"
                placeholder="01234 567890"
                value={form.phone}
                onChange={set('phone')}
                className={inputCls}
              />
            </Field>
            <Field label="Website">
              <input
                type="text"
                placeholder="www.yoursite.co.uk"
                value={form.website}
                onChange={set('website')}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Address">
            <textarea
              placeholder={"123 High Street\nYour Town\nAB1 2CD"}
              value={form.address}
              onChange={set('address')}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Opening Hours">
            <textarea
              value={form.hours}
              onChange={set('hours')}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-white/20 text-white/60 hover:text-white text-sm font-bold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => valid && onConfirm(form)}
            disabled={!valid}
            className="flex-[2] bg-[#C8A042] text-[#0C0C0C] font-bold text-sm uppercase tracking-wider py-3 rounded-lg hover:bg-[#DDB85A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create My Menu →
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
        {label}{required && <span className="text-[#C8A042] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#C8A042]/60 focus:bg-white/8 transition-colors'
