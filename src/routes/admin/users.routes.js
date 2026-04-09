const { Router } = require('express');
const { listUsers, getUserCheckins, getMetrics } = require('../../controllers/admin/users.controller');

const router = Router();

router.get('/metrics', getMetrics);
router.get('/', listUsers);
router.get('/:id/checkins', getUserCheckins);

module.exports = router;
