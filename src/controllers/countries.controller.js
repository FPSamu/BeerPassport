const supabase = require('../config/supabase');

// GET /countries
async function listCountries(req, res) {
  const { data, error } = await supabase
    .from('countries')
    .select('id, name, iso_code, flag_emoji')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

module.exports = { listCountries };
