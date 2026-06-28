const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const Admission = require('../models/Admission');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Enquiry = require('../models/Enquiry');

// GET: Dashboard Statistics (Protected Route)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Count documents across all primary collections
        const totalAdmissions = await Admission.count();
        const totalEvents = await Event.count();
        const totalGalleryPhotos = await Gallery.count();
        const totalEnquiries = await Enquiry.count();
        
        // Fetch recent enquiries for a quick glance table
        const recentEnquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']], limit: 5 });

        res.json({
            stats: {
                totalAdmissions,
                totalEvents,
                totalGalleryPhotos,
                totalEnquiries
            },
            recentEnquiries
        });
    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
});

module.exports = router;
