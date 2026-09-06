const { createClient } = require('@supabase/supabase-js')

async function verify(token, sb) {
  if (!token) return null
  const { data } = await sb.from('ma_sessions').select('*').eq('token', token).single()
  if (!data || new Date(data.expires_at) < new Date()) return null
  return data
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  const session = await verify(req.headers.authorization, sb)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { key } = req.query

  if (req.method === 'GET') {
    const { data } = await sb.from('ma_data').select('value').eq('key', key).single()
    return res.json({ value: data?.value ?? null })
  }

  if (req.method === 'POST') {
    const { value } = req.body || {}
    const { error } = await sb.from('ma_data').upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    await sb.from('ma_data').delete().eq('key', key)
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
