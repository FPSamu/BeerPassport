const supabase = require('../config/supabase');

// GET /wishlist
async function listWishlist(req, res) {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select('id, added_at, beers(id, name, brand, image_url, abv, beer_styles(name), countries(name, iso_code, flag_emoji))')
    .eq('user_id', req.user.id)
    .order('added_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

// POST /wishlist
async function addToWishlist(req, res) {
  const { beer_id } = req.body;

  if (!beer_id) return res.status(400).json({ error: 'beer_id es requerido' });

  const { data, error } = await supabase
    .from('user_wishlist')
    .insert({ user_id: req.user.id, beer_id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'La cerveza ya está en tu wishlist' });
    }
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
}

// DELETE /wishlist/:beer_id
async function removeFromWishlist(req, res) {
  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('user_id', req.user.id)
    .eq('beer_id', req.params.beer_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
}

module.exports = { listWishlist, addToWishlist, removeFromWishlist };
