require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Protect admin HTML files from direct URL access without authentication
app.use((req, res, next) => {
    // Check if the requested path is an admin HTML page (but not the login page)
    if (req.path.startsWith('/admin-') && !req.path.startsWith('/admin-login')) {
        const token = req.cookies.adminToken;
        if (!token) {
            return res.redirect('/admin-login.html');
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return next();
        } catch (err) {
            return res.redirect('/admin-login.html');
        }
    }
    next();
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../frontend/views'), { extensions: ['html'] })); // So URLs like /admin-login work
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection Setup
const { connectDB, sequelize } = require('./config/db');

// Connect to DB and sync models
connectDB().then(() => {
    // Sync models with database
    // Use { alter: true } to update tables if models change. Use { force: true } to drop and recreate.
    sequelize.sync({ alter: true })
        .then(() => console.log('Database synced successfully.'))
        .catch(err => console.error('Error syncing database:', err));
});

// Import Routes
const admissionsRoute = require('./routes/admissionsRoute');
const eventsRoute = require('./routes/eventsRoute');
const galleryRoute = require('./routes/galleryRoute');
const enquiriesRoute = require('./routes/enquiriesRoute');
const authRoute = require('./routes/authRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const noticesRoute = require('./routes/noticesRoute');
const circularsRoute = require('./routes/circularsRoute');
const achievementsRoute = require('./routes/achievementsRoute');
const feeEnquiriesRoute = require('./routes/feeEnquiriesRoute');
const bannersRoute = require('./routes/bannersRoute');
const testimonialsRoute = require('./routes/testimonialsRoute');
const contentRoute = require('./routes/contentRoute');
const teachersRoute = require('./routes/teachersRoute');
const topStudentsRoute = require('./routes/topStudentsRoute');
const announcementsRoute = require('./routes/announcementsRoute');

app.use('/api/admissions', admissionsRoute);
app.use('/api/events', eventsRoute);
app.use('/api/gallery', galleryRoute);
app.use('/api/enquiries', enquiriesRoute);
app.use('/api/auth', authRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/notices', noticesRoute);
app.use('/api/circulars', circularsRoute);
app.use('/api/achievements', achievementsRoute);
app.use('/api/fee-enquiries', feeEnquiriesRoute);
app.use('/api/banners', bannersRoute);
app.use('/api/testimonials', testimonialsRoute);
app.use('/api/content', contentRoute);
app.use('/api/teachers', teachersRoute);
app.use('/api/top-students', topStudentsRoute);
app.use('/api/announcements', announcementsRoute);

// Basic Route for testing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
