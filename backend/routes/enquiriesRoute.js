const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const Enquiry = require('../models/Enquiry');

// POST: Submit a new enquiry (Public)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;
        
        // Basic backend validation
        if (!name || !email || !mobile || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await Enquiry.create({
            name, email, mobile, message
        });
        res.status(201).json({ message: 'Thank you! Your message has been sent successfully. We will contact you soon.' });
    } catch (err) {
        console.error('Enquiry submission error:', err);
        res.status(500).json({ message: 'Error submitting enquiry. Please try again later.', error: err.message });
    }
});

// GET: Fetch all enquiries (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] }); // Newest first
        res.status(200).json(enquiries);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
    }
});

// PUT: Update enquiry status (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const [updatedCount] = await Enquiry.update({ status }, { where: { id: req.params.id } });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        
        const updatedEnquiry = await Enquiry.findByPk(req.params.id);

        res.status(200).json({ message: 'Status updated successfully', enquiry: updatedEnquiry });
    } catch (err) {
        res.status(500).json({ message: 'Error updating enquiry', error: err.message });
    }
});

// DELETE: Remove an enquiry (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const enquiry = await Enquiry.destroy({ where: { id: req.params.id } });
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting enquiry', error: err.message });
    }
});

module.exports = router;
