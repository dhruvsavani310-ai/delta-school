const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const Notice = require('../models/Notice');

// GET all active notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.findAll({ where: { isActive: true }, order: [['noticeDate', 'DESC']] });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notices', error: err.message });
    }
});

// GET all notices (Admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const notices = await Notice.findAll({ order: [['noticeDate', 'DESC']] });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notices', error: err.message });
    }
});

// POST new notice (Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newNotice = await Notice.create(req.body);
        res.status(201).json({ message: 'Notice added successfully', notice: newNotice });
    } catch (err) {
        res.status(500).json({ message: 'Error adding notice', error: err.message });
    }
});

// PUT update notice (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const [updatedCount] = await Notice.update(req.body, { where: { id: req.params.id } });
        if (updatedCount === 0) return res.status(404).json({ message: 'Not found' });
        const updated = await Notice.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating notice', error: err.message });
    }
});

// DELETE notice (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Notice.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting', error: err.message });
    }
});

module.exports = router;
