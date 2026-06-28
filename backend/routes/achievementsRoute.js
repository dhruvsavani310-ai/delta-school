const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const Achievement = require('../models/Achievement');

// GET all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.findAll({ order: [['achievedDate', 'DESC']] });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching achievements', error: err.message });
    }
});

// POST new achievement (Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newAchievement = await Achievement.create(req.body);
        res.status(201).json({ message: 'Achievement added successfully', achievement: newAchievement });
    } catch (err) {
        res.status(500).json({ message: 'Error adding achievement', error: err.message });
    }
});

// PUT update achievement (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const [updatedCount] = await Achievement.update(req.body, { where: { id: req.params.id } });
        if (updatedCount === 0) return res.status(404).json({ message: 'Not found' });
        const updated = await Achievement.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating', error: err.message });
    }
});

// DELETE achievement (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Achievement.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting', error: err.message });
    }
});

module.exports = router;
