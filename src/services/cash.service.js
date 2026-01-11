const Transaction = require('../models/Transaction.model');
const Dette = require('../models/Dette.model');
const Employe = require('../models/Employe.model');
const { Op } = require('sequelize');

class CashService {

    /**
     * Enregistre une nouvelle entrée ou sortie d'argent
     * @param {Object} data - Les données de la transaction (montant, famille, type...)
     */
    static async addTransaction(data) {
        try {
            // 1. Validation de base : On ne dépense pas l'argent qu'on n'a pas
            if (data.type === 'SORTIE') {
                const soldeActuel = await this.getSoldeCaisse();
                if (soldeActuel < data.montant) {
                    throw new Error(`Fonds insuffisants. Caisse: ${soldeActuel} FCFA, Demande: ${data.montant} FCFA`);
                }
            }

            // 2. Création de la transaction dans le Grand Livre
            const transaction = await Transaction.create({
                date_transaction: data.date || new Date(),
                type: data.type, // ENTREE ou SORTIE
                montant: data.montant,
                famille: data.famille, // EXPLOITATION, FINANCE, REGULARISATION...
                categorie: data.categorie,
                description: data.description,
                moyen_paiement: data.moyen_paiement || 'CASH',
                moto_id: data.moto_id || null,
                employe_id: data.employe_id || null
            });

            // 3. AUTOMATISMES WINK (Logique Métier)
            
            // Cas A : Si c'est un REMBOURSEMENT DE DETTE, on met à jour la dette liée
            if (data.famille === 'REMBOURSEMENT' && data.dette_id) {
                const dette = await Dette.findByPk(data.dette_id);
                if (dette) {
                    dette.reste_a_payer -= data.montant;
                    if (dette.reste_a_payer <= 0) {
                        dette.reste_a_payer = 0;
                        dette.statut = 'PAYE';
                    }
                    await dette.save();
                }
            }

            return transaction;

        } catch (error) {
            console.error("Erreur CashService:", error);
            throw error;
        }
    }

    /**
     * Calcule le solde réel disponible en caisse
     */
    static async getSoldeCaisse() {
        const totalEntrees = await Transaction.sum('montant', { where: { type: 'ENTREE' } }) || 0;
        const totalSorties = await Transaction.sum('montant', { where: { type: 'SORTIE' } }) || 0;
        return totalEntrees - totalSorties;
    }

    /**
     * Récupère l'historique récent pour le Journal
     */
    static async getHistory(limit = 50) {
        return await Transaction.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit,
            include: [
                { model: Employe, as: 'employe', attributes: ['nom_complet'] }
                // Note: On ajoutera l'include Moto quand on fera les liaisons
            ]
        });
    }
}

module.exports = CashService;