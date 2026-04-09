const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

const authRoutes = require('./auth.routes');
const beersRoutes = require('./beers.routes');
const checkinsRoutes = require('./checkins.routes');
const wishlistRoutes = require('./wishlist.routes');
const usersRoutes = require('./users.routes');
const countriesRoutes = require('./countries.routes');
const adminBeersRoutes = require('./admin/beers.routes');
const adminUsersRoutes = require('./admin/users.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/beers', beersRoutes);
router.use('/checkins', checkinsRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/users', usersRoutes);
router.use('/countries', countriesRoutes);

// Rutas de admin — requieren autenticación + rol admin
router.use('/admin/beers', requireAuth, requireAdmin, adminBeersRoutes);
router.use('/admin/users', requireAuth, requireAdmin, adminUsersRoutes);

module.exports = router;
