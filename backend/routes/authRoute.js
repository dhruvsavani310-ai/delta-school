const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for login to prevent brute force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window`
    message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// POST: Admin Login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 1. Check if admin exists
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // 3. Generate JWT
        const payload = {
            admin: {
                id: admin.id,
                email: admin.email,
                role: admin.role
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // Shortened to 2 hours for better security
        );

        // 4. Set HttpOnly Cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true if in production (requires HTTPS)
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000 // 2 hours in ms
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// POST: Admin Logout
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ message: 'Logged out successfully' });
});

// GET: Current logged in user details
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.admin.id, { attributes: ['id', 'email', 'role'] });
        if (!admin) return res.status(404).json({ message: 'User not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- SUPER ADMIN ONLY ROUTES ---

// GET: List all admins
router.get('/admins', authMiddleware, authorizeRole('Super Admin'), async (req, res) => {
    try {
        const admins = await Admin.findAll({ attributes: ['id', 'email', 'role', 'createdAt'] });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST: Create new admin
router.post('/admins', authMiddleware, authorizeRole('Super Admin'), async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({ 
            email, 
            password: hashedPassword,
            role: role || 'Admin'
        });
        
        res.status(201).json({ message: 'Admin created successfully', admin: { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT: Edit an admin
router.put('/admins/:id', authMiddleware, authorizeRole('Super Admin'), async (req, res) => {
    try {
        const { role, password } = req.body;
        const adminToUpdate = await Admin.findByPk(req.params.id);
        
        if (!adminToUpdate) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (role) {
            adminToUpdate.role = role;
        }

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            adminToUpdate.password = await bcrypt.hash(password, salt);
        }

        await adminToUpdate.save();

        res.json({ message: 'Admin updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE: Remove an admin
router.delete('/admins/:id', authMiddleware, authorizeRole('Super Admin'), async (req, res) => {
    try {
        if (req.params.id == req.admin.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        const deleted = await Admin.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Admin not found' });
        
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
