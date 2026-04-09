const { Router } = require('express');
const {
  listPending,
  approveBeer,
  rejectBeer,
  markDuplicate,
  createCatalogBeer,
  updateCatalogBeer,
} = require('../../controllers/admin/beers.controller');

const router = Router();

router.get('/pending', listPending);
router.post('/', createCatalogBeer);
router.patch('/:id', updateCatalogBeer);
router.patch('/:id/approve', approveBeer);
router.patch('/:id/reject', rejectBeer);
router.patch('/:id/duplicate', markDuplicate);

module.exports = router;
