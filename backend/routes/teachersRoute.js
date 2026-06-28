const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');

// GET: Fetch all active teachers (Public)
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.findAll({ where: { status: 'Active' }, order: [['createdAt', 'DESC']] });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch all teachers including inactive (Protected - Admin only)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const teachers = await Teacher.findAll({ order: [['createdAt', 'DESC']] });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new teacher (Protected - Admin only)
router.post('/', authMiddleware, uploadMedia.single('photo'), async (req, res) => {
    try {
        const { name, subject, qualification, experience, status, email, mobile } = req.body;
        
        const teacherData = {
            name,
            subject,
            qualification,
            experience,
            status: status || 'Active',
            email: email || null,
            mobile: mobile || null
        };

        if (req.file) {
            teacherData.photo = req.file.path;
        }

        const newTeacher = await Teacher.create(teacherData);
        res.status(201).json(newTeacher);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update an existing teacher (Protected - Admin only)
router.put('/:id', authMiddleware, uploadMedia.single('photo'), async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const { name, subject, qualification, experience, status, email, mobile } = req.body;
        
        const updateData = {
            name,
            subject,
            qualification,
            experience,
            status,
            email: email || null,
            mobile: mobile || null
        };

        if (req.file) {
            updateData.photo = req.file.path;
            if (teacher.photo) deleteLocalFile(teacher.photo);
        }

        await teacher.update(updateData);
        res.json(teacher);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a teacher (Protected - Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        await teacher.destroy();
        if (teacher.photo) deleteLocalFile(teacher.photo);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
