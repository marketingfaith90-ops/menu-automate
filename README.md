# Menu Automate 🍛

A Next.js + Supabase web app for creating professional restaurant menus from templates.

---

## 🚀 Deploy in 5 Steps

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Paste and run the entire contents of `supabase/schema.sql`
3. This creates the `templates` and `menus` tables and seeds the "Indian Classic" template

### 2. Get your Supabase keys

Go to **Project Settings → API** and copy:
- `Project URL`  → this is your `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set up locally

```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key in .env.local

npm install
npm run dev
# Open http://localhost:3000
```

### 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/menu-automate.git
git push -u origin main
```

### 5. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
2. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Deploy** — done ✓

---

## 📁 Project Structure

```
app/
  page.tsx                    # Landing page — template gallery
  create/[templateId]/        # Menu editor for a new menu
  menus/[menuId]/             # View & edit a saved menu
components/
  BusinessSetupModal.tsx      # "Enter your business details" modal
  MenuEditor.tsx              # Full inline-editable menu (routes by template style)
lib/
  supabase.ts                 # Supabase client
  types.ts                    # TypeScript types
supabase/
  schema.sql                  # Run this in Supabase SQL Editor
```

## ➕ Adding New Templates

1. Add a new row to `templates` in Supabase with a new `style` slug and `default_data` JSON
2. In `MenuEditor.tsx`, add a new `if (templateStyle === 'your-style')` branch that renders your layout component
3. Create the layout component following the same pattern as `IndianClassicLayout`

---

## 🖨 Printing / PDF Export

Click **Print / PDF** in the top bar → in your browser's print dialog:
- Set **Destination** to "Save as PDF"
- Set paper size to **A3 Landscape** for a full tri-fold menu
- Disable headers/footers
- Enable **Background graphics**
