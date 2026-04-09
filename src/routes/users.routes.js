const { Router } = require('express');
const { getProfile, updateProfile, getPassport, getMap } = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.use(requireAuth);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/me/passport', getPassport);
router.get('/me/map', getMap);

module.exports = router;
