const supabase = require('../config/supabase');

async function requireAdmin(req, res, next) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (error || !data) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  if (data.role !== 'admin') {
    return res.status(403).json({ error: 'Se requiere rol de administrador' });
  }

  next();
}

module.exports = { requireAdmin };
