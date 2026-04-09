const supabase = require('../../config/supabase');

// GET /admin/users
async function listUsers(req, res) {
  const { search, page = 1, limit = 20 } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  let query = supabase
    .from('users')
    .select('id, username, display_name, avatar_url, role, created_at', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (search) query = query.ilike('username', `%${search}%`);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
}

// GET /admin/users/:id/checkins
async function getUserCheckins(req, res) {
  const { data, error } = await supabase
    .from('checkins')
    .select('*, beers(id, name, brand), countries(name, iso_code, flag_emoji)')
    .eq('user_id', req.params.id)
    .order('checked_in_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

// GET /admin/metrics
async function getMetrics(req, res) {
  const [usersRes, checkinsRes, beersRes, pendingRes, countriesRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('checkins').select('id', { count: 'exact', head: true }),
    supabase.from('beers').select('id', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('beers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('checkins').select('country_id').not('country_id', 'is', null),
  ]);

  const uniqueCountries = new Set(countriesRes.data?.map(r => r.country_id)).size;

  res.json({
    total_users: usersRes.count,
    total_checkins: checkinsRes.count,
    total_beers: beersRes.count,
    pending_suggestions: pendingRes.count,
    countries_represented: uniqueCountries,
  });
}

module.exports = { listUsers, getUserCheckins, getMetrics };
