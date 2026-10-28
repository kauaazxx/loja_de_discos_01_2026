const express = require('express');
const router = express.Router();

const movController = require('../controllers/movController');

router.post('/', movController.registrarMovimentacao);

module.exports = router;