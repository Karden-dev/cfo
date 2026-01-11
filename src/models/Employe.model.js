const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employe = sequelize.define('Employe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_complet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    // VOCABULAIRE WINK : Tes catégories exactes
    role: {
        type: DataTypes.ENUM('LIVREUR_MOTO', 'PIETON', 'BUREAU', 'DG'),
        defaultValue: 'LIVREUR_MOTO'
    },
    date_embauche: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    // --- GESTION PAIE WINK ---
    salaire_base: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Le montant fixe mensuel avant primes/pénalités"
    },
    // LE COMPTEUR D'ARGENT (Le plus important)
    // - Si Positif (+10 000) : L'employé te doit de l'argent (Manquant caisse ou Avance prise).
    // - Si Négatif (-50 000) : Tu lui dois de l'argent (Salaire non payé).
    // - Si Zéro : Tout est carré.
    solde_courant: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    est_actif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'employes', // Nom de la table dans MariaDB
    timestamps: true       // Ajoute createdAt et updatedAt
});

module.exports = Employe;