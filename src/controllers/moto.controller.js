const MotoService = require('../services/moto.service');

exports.create = async (req, res) => {
    try {
        const moto = await MotoService.createMoto(req.body);
        res.status(201).json({ success: true, data: moto });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const motos = await MotoService.getAllMotos();
        res.status(200).json({ success: true, data: motos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        await MotoService.updateMoto(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Mise à jour réussie" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};