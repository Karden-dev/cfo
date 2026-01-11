const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Moto = sequelize.define('Moto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ex: CE-123-AB
    },
    chassis: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    modele: {
        type: DataTypes.STRING,
        defaultValue: 'TVS HLX 150'
    },
    date_achat: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    // État de santé de la moto
    etat: {
        type: DataTypes.ENUM('ACTIVE', 'PANNE', 'GARAGE', 'VENDUE', 'VOLEE'),
        defaultValue: 'ACTIVE'
    },
    // --- SUIVI TECHNIQUE (Alertes Vidanges) ---
    km_actuel: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    prochaine_vidange_km: {
        type: DataTypes.INTEGER,
        defaultValue: 3000 // Alerte par défaut
    },
    // --- MOUCHARD DE RENTABILITÉ ---
    // Ces champs seront mis à jour automatiquement par les Services
    recette_totale: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cout_entretien_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'motos',
    timestamps: true
});

module.exports = Moto;