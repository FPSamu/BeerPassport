const { Router } = require('express');
const { listWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.use(requireAuth);

router.get('/', listWishlist);
router.post('/', addToWishlist);
router.delete('/:beer_id', removeFromWishlist);

module.exports = router;
