const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  const action = req.query.action

  if (req.method === 'POST' && action === 'login') {
    const { username, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' })

    // Admin check
    if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36)
      const exp = new Date(Date.now() + 30 * 864e5).toISOString()
      await sb.from('ma_sessions').insert({ token, username: 'admin', role: 'admin', expires_at: exp })
      return res.json({ token, username: 'admin', role: 'admin' })
    }

    // Team user
    const { data: user } = await sb.from('ma_users').select('*').eq('username', username).single()
    if (!user || user.password !== password) return res.status(401).json({ error: 'Wrong username or password' })

    const token = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const exp = new Date(Date.now() + 30 * 864e5).toISOString()
    await sb.from('ma_sessions').insert({ token, username: user.username, role: user.role, expires_at: exp })
    return res.json({ token, username: user.username, role: user.role })
  }

  if (req.method === 'POST' && action === 'logout') {
    const token = req.headers.authorization
    if (token) await sb.from('ma_sessions').delete().eq('token', token)
    return res.json({ ok: true })
  }

  if (req.method === 'GET' && action === 'verify') {
    const token = req.headers.authorization
    if (!token) return res.status(401).json({ error: 'No token' })
    const { data } = await sb.from('ma_sessions').select('*').eq('token', token).single()
    if (!data || new Date(data.expires_at) < new Date()) {
      await sb.from('ma_sessions').delete().eq('token', token)
      return res.status(401).json({ error: 'Session expired' })
    }
    return res.json({ username: data.username, role: data.role })
  }

  res.status(404).json({ error: 'Unknown action' })
}
