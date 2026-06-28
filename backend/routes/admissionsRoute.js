const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Admission = require('../models/Admission');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'delta_school/admissions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST: Submit Admission Form
router.post('/', upload.fields([
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const { studentName, dob, gender, classApplyingFor, mediumOfInstruction, fatherName, motherName, mobile, email, address } = req.body;
        
        // Validate if files exist
        if (!req.files || !req.files['studentPhoto'] || !req.files['birthCertificate']) {
            return res.status(400).json({ message: 'Both Student Photo and Birth Certificate are required.' });
        }

        const studentPhotoPath = req.files['studentPhoto'][0].path;
        const birthCertificatePath = req.files['birthCertificate'][0].path;

        await Admission.create({
            studentName, 
            dob, 
            gender, 
            classApplyingFor, 
            mediumOfInstruction,
            fatherName, 
            motherName, 
            mobile, 
            email, 
            address,
            studentPhoto: studentPhotoPath,
            birthCertificate: birthCertificatePath
        });
        res.status(201).json({ message: 'Admission form submitted successfully! We will contact you soon.' });
    } catch (error) {
        console.error('Admission submission error:', error);
        res.status(500).json({ message: 'Server error while submitting the form.', error: error.message });
    }
});

// GET all admissions (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const admissions = await Admission.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(admissions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admissions', error: err.message });
    }
});

// PUT update admission status (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

        const [updatedCount] = await Admission.update({ status }, { where: { id: req.params.id } });
        if (updatedCount === 0) return res.status(404).json({ message: 'Not found' });
        const updated = await Admission.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating admission', error: err.message });
    }
});

// DELETE admission (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Admission.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting', error: err.message });
    }
});

module.exports = router;
