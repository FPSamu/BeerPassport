const { Router } = require('express');
const { listCountries } = require('../controllers/countries.controller');

const router = Router();

router.get('/', listCountries);

module.exports = router;
