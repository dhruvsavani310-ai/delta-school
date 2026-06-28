const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');
const Gallery = require('../models/Gallery');

// GET: Fetch all gallery images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching gallery images', error: err.message });
    }
});

// POST: Upload single image to a category
router.post('/', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        const { title, category } = req.body;
        
        // Validate Category
        const validCategories = ['Campus', 'Events', 'Sports', 'Annual Day', 'Sports Day', 'Science Fair', 'Cultural Program', 'School Trip'];
        if (!category || !validCategories.includes(category)) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(400).json({ message: 'Invalid or missing category' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const newImage = await Gallery.create({
            title: title || 'Gallery Image',
            imageUrl: req.file.path,
            category: category
        });
        
        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(500).json({ message: 'Error uploading image', error: err.message });
    }
});

// DELETE: Remove an image
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const image = await Gallery.findByPk(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        await Gallery.destroy({ where: { id: req.params.id } });
        
        if (image.imageUrl) {
            deleteLocalFile(image.imageUrl);
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting image', error: err.message });
    }
});

module.exports = router;
