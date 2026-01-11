const express = require('express');
const router = express.Router();
const cashController = require('../controllers/cash.controller');

// ============================================================
// ROUTES API - GESTION DU CASH
// ============================================================

// 1. Ajouter une transaction (Recette ou Dépense)
// URL: http://localhost:3000/api/cash/add
router.post('/add', cashController.addTransaction);

// 2. Obtenir le solde actuel et l'historique
// URL: http://localhost:3000/api/cash/status
router.get('/status', cashController.getStatus);

module.exports = router;