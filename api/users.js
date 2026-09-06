const { createClient } = require('@supabase/supabase-js')

async function isAdmin(token, sb) {
  if (!token) return false
  const { data } = await sb.from('ma_sessions').select('role').eq('token', token).single()
  return data?.role === 'admin'
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  if (!await isAdmin(req.headers.authorization, sb))
    return res.status(403).json({ error: 'Admin only' })

  if (req.method === 'GET') {
    const { data } = await sb.from('ma_users').select('id,username,name,role,created_at').order('created_at')
    return res.json(data || [])
  }

  if (req.method === 'POST') {
    const { username, password, name, role } = req.body || {}
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' })
    const { error } = await sb.from('ma_users').insert({ username, password, name: name || username, role: role || 'designer' })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    await sb.from('ma_users').delete().eq('id', id)
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
