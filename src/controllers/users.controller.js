const supabase = require('../config/supabase');

// GET /users/me
async function getProfile(req, res) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, bio, created_at')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json(data);
}

// PATCH /users/me
async function updateProfile(req, res) {
  const { display_name, bio, avatar_url } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update({ display_name, bio, avatar_url })
    .eq('id', req.user.id)
    .select('id, username, display_name, avatar_url, bio')
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
}

// GET /users/me/passport
async function getPassport(req, res) {
  const { data, error } = await supabase.rpc('get_user_passport', {
    p_user_id: req.user.id,
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

// GET /users/me/map
async function getMap(req, res) {
  const { data, error } = await supabase
    .from('checkins')
    .select('countries(id, name, iso_code, flag_emoji)')
    .eq('user_id', req.user.id)
    .not('country_id', 'is', null);

  if (error) return res.status(500).json({ error: error.message });

  const countries = [...new Map(
    data.map(r => [r.countries.id, r.countries])
  ).values()];

  res.json(countries);
}

module.exports = { getProfile, updateProfile, getPassport, getMap };
