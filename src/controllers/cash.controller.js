const CashService = require('../services/cash.service');

// 1. AJOUTER UNE TRANSACTION (Recette ou Dépense)
exports.addTransaction = async (req, res) => {
    try {
        // On récupère les données envoyées par le formulaire
        const data = req.body;

        // On appelle l'Expert (Service)
        const transaction = await CashService.addTransaction(data);

        // On répond au site web que c'est bon
        res.status(201).json({
            success: true,
            message: 'Transaction enregistrée avec succès',
            data: transaction
        });

    } catch (error) {
        console.error('Erreur Controller Cash:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Erreur lors de l'enregistrement"
        });
    }
};

// 2. OBTENIR LE SOLDE ET L'HISTORIQUE
exports.getStatus = async (req, res) => {
    try {
        // On demande les chiffres à l'Expert
        const solde = await CashService.getSoldeCaisse();
        const historique = await CashService.getHistory();

        res.status(200).json({
            success: true,
            solde: solde,
            historique: historique
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};