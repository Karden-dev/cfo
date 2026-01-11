const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dette = sequelize.define('Dette', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    creancier: {
        type: DataTypes.STRING, 
        allowNull: false,
        comment: "Qui on doit payer ? (Ex: Banque Afriland, Bailleur Bureau)"
    },
    type: {
        type: DataTypes.ENUM('EMPRUNT_BANQUE', 'TONTINE', 'LOYER', 'FOURNISSEUR', 'SALAIRE_RETARD', 'AUTRE'),
        defaultValue: 'AUTRE'
    },
    montant_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reste_a_payer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_echeance: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('EN_COURS', 'RETARD', 'PAYE', 'ANNULE'),
        defaultValue: 'EN_COURS'
    },
    priorite: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        comment: "1=Vital (Loyer/Salaires), 2=Important, 3=Peut attendre"
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'dettes',
    timestamps: true
});

module.exports = Dette;