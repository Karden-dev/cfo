require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const sequelize = require('./config/database'); // Notre connexion Sequelize

// ============================================================
// 1. INITIALISATION
// ============================================================
const app = express();
const server = http.createServer(app); // On crée le serveur HTTP

// ============================================================
// 2. MIDDLEWARES (Sécurité & Formatage)
// ============================================================
app.use(cors()); // Accepte les connexions de l'extérieur
app.use(express.json()); // Comprend le JSON
app.use(express.urlencoded({ extended: true })); // Comprend les formulaires
app.use(express.static(path.join(__dirname, '../public'))); // Sert les fichiers HTML/CSS/JS

// ============================================================
// 3. IMPORTS DES ROUTES (API)
// ============================================================
// Je commente les lignes tant que les fichiers n'existent pas encore
// pour éviter que ton serveur ne plante tout de suite.
// On décommentera au fur et à mesure (Phase 4).

// const authRoutes = require('./routes/auth.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');
// const cashRoutes = require('./routes/cash.routes');
// const debtRoutes = require('./routes/debt.routes');
// const riderRoutes = require('./routes/rider.routes');
// const financeRoutes = require('./routes/finance.routes');

// ============================================================
// 4. UTILISATION DES ROUTES
// ============================================================
// app.use('/api/auth', authRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/cash', cashRoutes);
// app.use('/api/debts', debtRoutes);
// app.use('/api/riders', riderRoutes);

// ============================================================
// 5. POINT D'ENTRÉE FRONTEND
// ============================================================
// Si on demande une page qui n'est pas l'API, on renvoie le site web
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================================
// 6. DÉMARRAGE DU SERVEUR
// ============================================================
const PORT = process.env.PORT || 3000;

// On vérifie la base de données avant de lancer
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ BASE DE DONNÉES CONNECTÉE');
        server.listen(PORT, () => {
            console.log(`🚀 WINK CFO SYSTEM tourne sur http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ ERREUR DE BASE DE DONNÉES :', err);
    });

module.exports = app;