const express = require('express');
const router = express.Router();
const motoController = require('../controllers/moto.controller');

// Routes : http://localhost:3000/api/motos
router.post('/add', motoController.create);      // Ajouter
router.get('/', motoController.getAll);          // Liste complète
router.put('/:id', motoController.update);       // Modifier (ex: Panne)

module.exports = router;