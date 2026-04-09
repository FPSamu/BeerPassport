const { Router } = require('express');
const { listBeers, getBeer, createCustomBeer, suggestBeer } = require('../controllers/beers.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', listBeers);
router.get('/:id', requireAuth, getBeer);
router.post('/custom', requireAuth, createCustomBeer);
router.post('/suggest', requireAuth, suggestBeer);

module.exports = router;
