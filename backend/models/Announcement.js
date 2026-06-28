const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Announcement = sequelize.define('Announcement', {
    text: { type: DataTypes.STRING, allowNull: false },
    linkUrl: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, defaultValue: '#ffffff' }, // text color e.g., red, green, #hex
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = Announcement;
