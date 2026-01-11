const Moto = require('../models/Moto.model');

class MotoService {

    /**
     * Créer une nouvelle moto dans la flotte
     */
    static async createMoto(data) {
        // On vérifie si le matricule existe déjà pour éviter les doublons
        const existing = await Moto.findOne({ where: { matricule: data.matricule } });
        if (existing) throw new Error("Ce matricule existe déjà !");

        return await Moto.create(data);
    }

    /**
     * Récupérer toutes les motos avec indicateurs de santé
     */
    static async getAllMotos() {
        const motos = await Moto.findAll({ order: [['id', 'ASC']] });
        
        // On ajoute des indicateurs calculés (ex: Alerte Vidange)
        return motos.map(m => {
            const moto = m.toJSON();
            
            // Calcul Rentabilité
            moto.marge = moto.recette_totale - moto.cout_entretien_total;
            
            // Alerte Vidange (Si on est à moins de 100km de l'échéance ou dépassé)
            moto.alerte_vidange = (moto.km_actuel >= moto.prochaine_vidange_km - 100);
            
            return moto;
        });
    }

    /**
     * Mettre à jour une moto (ex: Changer KM ou Statut)
     */
    static async updateMoto(id, data) {
        const moto = await Moto.findByPk(id);
        if (!moto) throw new Error("Moto introuvable");

        return await moto.update(data);
    }
}

module.exports = MotoService;