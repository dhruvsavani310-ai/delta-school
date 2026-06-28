const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authMiddleware } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// GET: Fetch active announcements (Public)
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const announcements = await Announcement.findAll({
            where: {
                isActive: true,
                [Op.or]: [
                    { startDate: null },
                    { startDate: { [Op.lte]: now } }
                ],
                [Op.or]: [
                    { endDate: null },
                    { endDate: { [Op.gte]: now } }
                ]
            },
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
        });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch all announcements including inactive (Protected - Admin only)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
        });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new announcement (Protected - Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text, linkUrl, color, isActive, displayOrder, startDate, endDate } = req.body;
        
        const newAnnouncement = await Announcement.create({
            text,
            linkUrl: linkUrl || null,
            color: color || '#ffffff',
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            startDate: startDate || null,
            endDate: endDate || null
        });
        res.status(201).json(newAnnouncement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update an existing announcement (Protected - Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const { text, linkUrl, color, isActive, displayOrder, startDate, endDate } = req.body;
        
        await announcement.update({
            text,
            linkUrl: linkUrl || null,
            color: color || '#ffffff',
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            startDate: startDate || null,
            endDate: endDate || null
        });
        
        res.json(announcement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove an announcement (Protected - Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        await announcement.destroy();
        res.json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
