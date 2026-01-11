const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_transaction: {
        type: DataTypes.DATEONLY, // On garde la date comptable
        defaultValue: DataTypes.NOW
    },
    type: {
        type: DataTypes.ENUM('ENTREE', 'SORTIE'),
        allowNull: false
    },
    montant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1 // Pas de transaction de 0 ou négative
        }
    },
    // --- LE CŒUR DE LA STRATÉGIE WINK ---
    famille: {
        type: DataTypes.ENUM(
            // LES ENTRÉES
            'EXPLOITATION',   // 🟢 Recette Livraison (Vrai Travail)
            'FINANCE',        // 🟠 Emprunt / Apport DG (Dette)
            'REGULARISATION', // 🔵 Recouvrement créance / Remboursement avance
            
            // LES SORTIES
            'CHARGES_OPS',    // 🛠️ Essence / Pannes (Lié aux motos)
            'CHARGES_FIXES',  // 🏢 Loyer / Salaires / Forfaits
            'REMBOURSEMENT'   // 💸 Paiement d'une dette (Sortie de cash, baisse de dette)
        ),
        allowNull: false
    },
    categorie: {
        type: DataTypes.STRING, // Ex: "Vidange", "Versement Matin", "Loyer Janvier"
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT // Détail (ex: "Vidange chez garagiste Paul + Patins")
    },
    moyen_paiement: {
        type: DataTypes.ENUM('CASH', 'ORANGE_MONEY', 'MTN_MOMO', 'VIREMENT'),
        defaultValue: 'CASH'
    },
    // --- LIENS (Qui et Quoi ?) ---
    // Note : Les relations (Foreign Keys) seront activées dans le fichier d'associations
    moto_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        comment: "Si la dépense ou recette concerne une moto précise"
    },
    employe_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        comment: "L'employé qui a fait la recette ou reçu l'argent"
    }
}, {
    tableName: 'transactions',
    timestamps: true
});

module.exports = Transaction;