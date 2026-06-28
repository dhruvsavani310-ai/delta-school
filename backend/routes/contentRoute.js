const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');

// Get specific content by key (Public)
router.get('/:key', async (req, res) => {
    try {
        const content = await SiteContent.findOne({ where: { key: req.params.key } });
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all content (Protected - for admin panel)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const content = await SiteContent.findAll();
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create or Update content (Protected)
router.post('/:key', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        let content = await SiteContent.findOne({ where: { key: req.params.key } });
        
        const updateData = {
            text: req.body.text,
            title: req.body.title,
            subtitle: req.body.subtitle
        };

        if (req.body.extraData) {
            try {
                updateData.extraData = typeof req.body.extraData === 'string' ? JSON.parse(req.body.extraData) : req.body.extraData;
            } catch (e) {
                console.error("Error parsing extraData:", e);
            }
        }

        if (req.file) {
            updateData.imageUrl = req.file.path;
            if (content && content.imageUrl) deleteLocalFile(content.imageUrl);
        }

        if (content) {
            // Update
            await SiteContent.update(updateData, { where: { key: req.params.key } });
            content = await SiteContent.findOne({ where: { key: req.params.key } });
        } else {
            // Create
            updateData.key = req.params.key;
            content = await SiteContent.create(updateData);
        }

        res.json(content);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
