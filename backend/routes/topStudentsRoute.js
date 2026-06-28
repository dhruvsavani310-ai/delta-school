const express = require('express');
const router = express.Router();
const TopStudent = require('../models/TopStudent');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMedia = require('../middleware/uploadMiddleware');
const { deleteLocalFile } = require('../utils/fileUtils');

// GET: Fetch all active top students (Public)
router.get('/', async (req, res) => {
    try {
        const students = await TopStudent.findAll({ 
            where: { status: 'Active' }, 
            order: [['academic_year', 'DESC'], ['studentClass', 'ASC'], ['rank', 'ASC']] 
        });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch all top students including inactive (Protected)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const students = await TopStudent.findAll({ 
            order: [['academic_year', 'DESC'], ['studentClass', 'ASC'], ['rank', 'ASC']] 
        });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a top student (Protected)
router.post('/', authMiddleware, uploadMedia.single('photo'), async (req, res) => {
    try {
        const { name, studentClass, rank, percentage, academic_year, status } = req.body;
        
        // Validation: Ensure unique rank per class and academic year
        const existingRank = await TopStudent.findOne({
            where: { studentClass, rank, academic_year }
        });
        
        if (existingRank) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(400).json({ message: `Rank ${rank} already exists for ${studentClass} in ${academic_year}` });
        }

        const studentData = {
            name,
            studentClass,
            rank,
            percentage,
            academic_year,
            status: status || 'Active'
        };

        if (req.file) {
            studentData.photo = req.file.path;
        }

        const newStudent = await TopStudent.create(studentData);
        res.status(201).json(newStudent);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update a top student (Protected)
router.put('/:id', authMiddleware, uploadMedia.single('photo'), async (req, res) => {
    try {
        const student = await TopStudent.findByPk(req.params.id);
        if (!student) {
            // if (req.file) { /* delete Cloudinary logic if needed */ }
            return res.status(404).json({ message: 'Student not found' });
        }

        const { name, studentClass, rank, percentage, academic_year, status } = req.body;
        
        // Validation if rank/class/year is changed
        if (studentClass !== student.studentClass || rank != student.rank || academic_year !== student.academic_year) {
            const existingRank = await TopStudent.findOne({
                where: { studentClass, rank, academic_year }
            });
            
            if (existingRank && existingRank.id !== student.id) {
                // if (req.file) { /* delete Cloudinary logic if needed */ }
                return res.status(400).json({ message: `Rank ${rank} already exists for ${studentClass} in ${academic_year}` });
            }
        }

        const updateData = {
            name,
            studentClass,
            rank,
            percentage,
            academic_year,
            status
        };

        if (req.file) {
            updateData.photo = req.file.path;
            if (student.photo) deleteLocalFile(student.photo);
        }

        await student.update(updateData);
        res.json(student);
    } catch (err) {
        // if (req.file) { /* delete Cloudinary logic if needed */ }
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a top student (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await TopStudent.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.destroy();
        if (student.photo) deleteLocalFile(student.photo);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
