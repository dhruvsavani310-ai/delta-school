const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');
const Banner = require('../models/Banner');

// GET all active banners (Public)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching banners', error: err.message });
    }
});

// GET all banners including inactive (Admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const banners = await Banner.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching banners', error: err.message });
    }
});

// POST new banner (Admin)
router.post('/', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        const bannerData = {
            title: req.body.title || '',
            isActive: req.body.isActive === 'true' || req.body.isActive === true
        };
        
        if (req.file) {
            bannerData.imageUrl = req.file.path;
        } else {
            return res.status(400).json({ message: 'Image is required' });
        }

        const newBanner = await Banner.create(bannerData);
        res.status(201).json({ message: 'Banner added successfully', banner: newBanner });
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(500).json({ message: 'Error adding banner', error: err.message });
    }
});

// PUT update banner (Admin)
router.put('/:id', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (!banner) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(404).json({ message: 'Banner not found' });
        }

        const updateData = {
            title: req.body.title || banner.title,
            isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : banner.isActive
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
            // Delete old image
            if (banner.imageUrl) deleteLocalFile(banner.imageUrl);
        }

        await Banner.update(updateData, { where: { id: req.params.id } });
        const updatedBanner = await Banner.findByPk(req.params.id);
        res.status(200).json(updatedBanner);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(500).json({ message: 'Error updating banner', error: err.message });
    }
});

// DELETE banner (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        
        await Banner.destroy({ where: { id: req.params.id } });
        
        if (banner.imageUrl) {
            deleteLocalFile(banner.imageUrl);
        }
        
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting banner', error: err.message });
    }
});

module.exports = router;
