const { Router } = require('express');
const { listCheckins, createCheckin, getCheckin, deleteCheckin } = require('../controllers/checkins.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.use(requireAuth);

router.get('/', listCheckins);
router.post('/', createCheckin);
router.get('/:id', getCheckin);
router.delete('/:id', deleteCheckin);

module.exports = router;
