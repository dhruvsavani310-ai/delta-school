const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all testimonials (Public)
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create testimonial (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newTestimonial = await Testimonial.create({
            name: req.body.name,
            role: req.body.role,
            quote: req.body.quote
        });
        res.status(201).json(newTestimonial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete testimonial (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedCount = await Testimonial.destroy({ where: { id: req.params.id } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
