const supabase = require('../config/supabase');

// GET /beers?search=&style_id=&country_id=&page=&limit=
async function listBeers(req, res) {
  const { search, style_id, country_id, page = 1, limit = 20 } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  let query = supabase
    .from('beers')
    .select('id, name, brand, abv, ibu, image_url, flavor_tags, beer_styles(name), countries(name, iso_code, flag_emoji)', { count: 'exact' })
    .eq('type', 'catalog')
    .eq('is_verified', true)
    .range(from, to);

  if (search) query = query.ilike('name', `%${search}%`);
  if (style_id) query = query.eq('style_id', style_id);
  if (country_id) query = query.eq('country_id', country_id);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
}

// GET /beers/:id
async function getBeer(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('beers')
    .select('*, beer_styles(name, category), countries(name, iso_code, flag_emoji)')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Cerveza no encontrada' });

  const isPublic = data.type === 'catalog' && data.is_verified;
  const isOwner = data.created_by === req.user?.id;

  if (!isPublic && !isOwner) {
    return res.status(404).json({ error: 'Cerveza no encontrada' });
  }

  res.json(data);
}

// POST /beers/custom
async function createCustomBeer(req, res) {
  const { name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url } = req.body;

  if (!name && !image_url && !style_id) {
    return res.status(400).json({ error: 'Se requiere al menos nombre, foto o estilo' });
  }

  const { data, error } = await supabase
    .from('beers')
    .insert({
      type: 'custom',
      name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url,
      created_by: req.user.id,
      status: 'approved',
      is_verified: false,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
}

// POST /beers/suggest
async function suggestBeer(req, res) {
  const { name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido para sugerir una cerveza al catálogo' });
  }

  const { data, error } = await supabase
    .from('beers')
    .insert({
      type: 'catalog',
      name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url,
      suggested_by: req.user.id,
      created_by: req.user.id,
      status: 'pending',
      is_verified: false,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
}

module.exports = { listBeers, getBeer, createCustomBeer, suggestBeer };
