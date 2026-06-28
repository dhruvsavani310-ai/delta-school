const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const Circular = require('../models/Circular');

// GET all circulars
router.get('/', async (req, res) => {
    try {
        const circulars = await Circular.findAll({ order: [['publishDate', 'DESC']] });
        res.json(circulars);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching circulars', error: err.message });
    }
});

// POST new circular (Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newCircular = await Circular.create(req.body);
        res.status(201).json({ message: 'Circular added successfully', circular: newCircular });
    } catch (err) {
        res.status(500).json({ message: 'Error adding circular', error: err.message });
    }
});

// PUT update circular (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const [updatedCount] = await Circular.update(req.body, { where: { id: req.params.id } });
        if (updatedCount === 0) return res.status(404).json({ message: 'Not found' });
        const updated = await Circular.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating', error: err.message });
    }
});

// DELETE circular (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Circular.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting', error: err.message });
    }
});

module.exports = router;
