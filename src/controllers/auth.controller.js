const supabase = require('../config/supabase');

// POST /auth/register
async function register(req, res) {
  const { email, password, username, display_name } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'email, password y username son requeridos' });
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    username,
    display_name: display_name || username,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return res.status(400).json({ error: profileError.message });
  }

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
}

// POST /auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  });
}

module.exports = { register, login };
