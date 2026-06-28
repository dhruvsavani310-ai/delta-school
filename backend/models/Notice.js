const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notice = sequelize.define('Notice', {
    title: { type: DataTypes.STRING, allowNull: false },
    noticeDate: { type: DataTypes.DATE, allowNull: false },
    pdfUrl: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

module.exports = Notice;
