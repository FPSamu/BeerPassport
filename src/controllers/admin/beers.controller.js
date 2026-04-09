const supabase = require('../../config/supabase');

// GET /admin/beers/pending
async function listPending(req, res) {
  const { data, error } = await supabase
    .from('beers')
    .select('*, beer_styles(name), countries(name, iso_code), users!suggested_by(username)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

// PATCH /admin/beers/:id/approve
async function approveBeer(req, res) {
  const updates = req.body; // admin puede editar campos antes de aprobar

  const { data, error } = await supabase
    .from('beers')
    .update({
      ...updates,
      status: 'approved',
      is_verified: true,
      type: 'catalog',
      verified_by: req.user.id,
      verified_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
}

// PATCH /admin/beers/:id/reject
async function rejectBeer(req, res) {
  const { rejection_reason } = req.body;

  const { data, error } = await supabase
    .from('beers')
    .update({
      status: 'rejected',
      rejection_reason,
      verified_by: req.user.id,
      verified_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
}

// PATCH /admin/beers/:id/duplicate
async function markDuplicate(req, res) {
  const { data, error } = await supabase
    .from('beers')
    .update({
      status: 'duplicate',
      verified_by: req.user.id,
      verified_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
}

// POST /admin/beers — crear cerveza verificada directamente
async function createCatalogBeer(req, res) {
  const { name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url } = req.body;

  if (!name) return res.status(400).json({ error: 'El nombre es requerido' });

  const { data, error } = await supabase
    .from('beers')
    .insert({
      type: 'catalog',
      name, brand, country_id, style_id, abv, ibu, description, flavor_tags, image_url,
      status: 'approved',
      is_verified: true,
      verified_by: req.user.id,
      verified_at: new Date().toISOString(),
      created_by: req.user.id,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
}

// PATCH /admin/beers/:id — editar cerveza del catálogo
async function updateCatalogBeer(req, res) {
  const { data, error } = await supabase
    .from('beers')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
}

module.exports = { listPending, approveBeer, rejectBeer, markDuplicate, createCatalogBeer, updateCatalogBeer };
