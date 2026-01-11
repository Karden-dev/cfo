const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debt.controller');

// ============================================================
// ROUTES API - GESTION DES DETTES
// ============================================================

// 1. Obtenir le radar des dettes (Urgences & Total)
// URL: http://localhost:3000/api/debts/radar
router.get('/radar', debtController.getRadar);

// 2. Ajouter une nouvelle dette (Emprunt, Facture...)
// URL: http://localhost:3000/api/debts/add
router.post('/add', debtController.createDebt);

module.exports = router;