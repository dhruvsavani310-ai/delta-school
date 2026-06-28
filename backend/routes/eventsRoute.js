const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');
const Event = require('../models/Event');

// GET: Fetch all events (Public Route)
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({ order: [['eventDate', 'ASC']] }); // Sort by upcoming dates
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
});

// POST: Add new event (Admin Route)
router.post('/', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        const { title, description, eventDate } = req.body;
        
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path;
        }
        
        if (!imageUrl) {
            return res.status(400).json({ message: 'Event image file is required' });
        }

        const newEvent = await Event.create({ title, description, eventDate, imageUrl });
        
        res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(500).json({ message: 'Error adding event', error: err.message });
    }
});

// PUT: Edit existing event (Admin Route)
router.put('/:id', authMiddleware, uploadMedia.single('image'), async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(404).json({ message: 'Event not found' });
        }

        const { title, description, eventDate } = req.body;
        const updateData = { title, description, eventDate };
        
        if (req.file) {
            updateData.imageUrl = req.file.path;
            if (event.imageUrl) deleteLocalFile(event.imageUrl);
        }

        await event.update(updateData);
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(500).json({ message: 'Error updating event', error: err.message });
    }
});

// DELETE: Remove event (Admin Route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        await event.destroy();
        
        if (event.imageUrl) {
            deleteLocalFile(event.imageUrl);
        }
        
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
});

module.exports = router;
