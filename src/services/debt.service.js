const Dette = require('../models/Dette.model');
const { Op } = require('sequelize');

class DebtService {

    /**
     * LE RADAR : Récupère les dettes urgentes à payer
     * @returns {Promise<Array>} Liste des dettes triées par urgence
     */
    static async getRadar() {
        try {
            const today = new Date();
            
            const dettes = await Dette.findAll({
                where: {
                    statut: { [Op.ne]: 'PAYE' } // On ne veut que ce qui n'est pas payé
                },
                order: [
                    ['priorite', 'ASC'],      // D'abord les priorités 1 (Vitales)
                    ['date_echeance', 'ASC']  // Ensuite les dates les plus proches
                ]
            });

            // On ajoute un indicateur visuel pour le frontend
            return dettes.map(dette => {
                const echeance = new Date(dette.date_echeance);
                const diffTime = echeance - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                let alerte = 'NORMAL';
                if (diffDays < 0) alerte = 'RETARD_CRITIQUE'; // C'est déjà passé !
                else if (diffDays <= 3) alerte = 'URGENT';    // C'est dans 3 jours max

                return {
                    ...dette.toJSON(),
                    jours_restants: diffDays,
                    niveau_alerte: alerte
                };
            });

        } catch (error) {
            console.error("Erreur DebtService Radar:", error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle dette (ex: Emprunt Bancaire)
     */
    static async createDebt(data) {
        return await Dette.create({
            creancier: data.creancier,
            montant_total: data.montant_total,
            reste_a_payer: data.montant_total, // Au début, on doit tout
            date_echeance: data.date_echeance,
            type: data.type,
            priorite: data.priorite || 2,
            description: data.description
        });
    }

    /**
     * Statistiques globales (Combien je dois au total ?)
     */
    static async getTotalDettes() {
        return await Dette.sum('reste_a_payer', {
            where: { statut: { [Op.ne]: 'PAYE' } }
        }) || 0;
    }
}

module.exports = DebtService;