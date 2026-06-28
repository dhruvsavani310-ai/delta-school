const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Gallery = sequelize.define('Gallery', {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Gallery Image' },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    category: {
        type: DataTypes.ENUM('Campus', 'Events', 'Sports', 'Annual Day', 'Sports Day', 'Science Fair', 'Cultural Program', 'School Trip'),
        allowNull: false
    }
}, { timestamps: true });

module.exports = Gallery;
