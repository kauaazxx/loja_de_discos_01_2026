const express = require('express');
const router = express.Router();

const discoController = require('../controllers/discoController');

router.get('/', discoController.listarDiscos);
router.get('/busca', discoController.listarDiscos);
router.post('/', discoController.criarDisco);
router.put('/:id', discoController.atualizarDisco);
router.delete('/:id', discoController.deletarDisco);

module.exports = router;