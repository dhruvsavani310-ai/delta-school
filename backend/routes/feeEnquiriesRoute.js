const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const FeeEnquiry = require('../models/FeeEnquiry');

// POST submit a fee enquiry
router.post('/', async (req, res) => {
    try {
        const { parentName, emailOrPhone, selectedClass, message } = req.body;
        
        // Basic estimated fee logic based on class for demo
        let estimatedFee = 50000;
        if (selectedClass.includes('Grade')) {
            estimatedFee = 75000;
        }

        await FeeEnquiry.create({
            parentName,
            emailOrPhone,
            selectedClass,
            message,
            estimatedFee
        });
        res.status(201).json({ message: 'Fee enquiry submitted successfully!', estimatedFee });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting fee enquiry', error: err.message });
    }
});

// GET all fee enquiries (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const enquiries = await FeeEnquiry.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(enquiries);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching', error: err.message });
    }
});

// PUT update status (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Contacted'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

        const [updatedCount] = await FeeEnquiry.update({ status }, { where: { id: req.params.id } });
        if (updatedCount === 0) return res.status(404).json({ message: 'Not found' });
        const updated = await FeeEnquiry.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating', error: err.message });
    }
});

// DELETE enquiry (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await FeeEnquiry.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting', error: err.message });
    }
});

module.exports = router;
