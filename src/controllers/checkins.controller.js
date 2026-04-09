const supabase = require('../config/supabase');

// GET /checkins — checkins del usuario autenticado
async function listCheckins(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  const { data, error, count } = await supabase
    .from('checkins')
    .select('*, beers(id, name, brand, image_url, beer_styles(name)), countries(name, iso_code, flag_emoji)', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('checked_in_at', { ascending: false })
    .range(from, to);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
}

// POST /checkins
async function createCheckin(req, res) {
  const { beer_id, rating, notes, photo_url, city, country_id, latitude, longitude, checked_in_at } = req.body;

  if (!beer_id || !rating || !country_id) {
    return res.status(400).json({ error: 'beer_id, rating y country_id son requeridos' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'El rating debe ser entre 1 y 5' });
  }

  const { data, error } = await supabase
    .from('checkins')
    .insert({
      user_id: req.user.id,
      beer_id, rating, notes, photo_url, city, country_id, latitude, longitude,
      checked_in_at: checked_in_at || new Date().toISOString(),
    })
    .select('*, beers(id, name, brand), countries(name, iso_code, flag_emoji)')
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
}

// GET /checkins/:id
async function getCheckin(req, res) {
  const { data, error } = await supabase
    .from('checkins')
    .select('*, beers(id, name, brand, image_url, beer_styles(name)), countries(name, iso_code, flag_emoji)')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Checkin no encontrado' });

  res.json(data);
}

// DELETE /checkins/:id
async function deleteCheckin(req, res) {
  const { error } = await supabase
    .from('checkins')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
}

module.exports = { listCheckins, createCheckin, getCheckin, deleteCheckin };
