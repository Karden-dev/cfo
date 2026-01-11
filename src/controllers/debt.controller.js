const DebtService = require('../services/debt.service');

// 1. LE RADAR (POUR LE DASHBOARD)
// Récupère les dettes urgentes et triées
exports.getRadar = async (req, res) => {
    try {
        const radar = await DebtService.getRadar();
        const totalDettes = await DebtService.getTotalDettes();

        res.status(200).json({
            success: true,
            radar: radar,
            total_dettes: totalDettes
        });
    } catch (error) {
        console.error('Erreur Controller Debt (Radar):', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. AJOUTER UNE NOUVELLE DETTE
// (Ex: Tu empruntes 500k à la banque ou à un tontinier)
exports.createDebt = async (req, res) => {
    try {
        const newDebt = await DebtService.createDebt(req.body);
        
        res.status(201).json({
            success: true,
            message: "Dette enregistrée. Le système va surveiller l'échéance.",
            data: newDebt
        });
    } catch (error) {
        console.error('Erreur Controller Debt (Add):', error);
        res.status(500).json({ success: false, message: error.message });
    }
};