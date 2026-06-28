const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Circular = sequelize.define('Circular', {
    title: { type: DataTypes.STRING, allowNull: false },
    publishDate: { type: DataTypes.DATE, allowNull: false },
    pdfUrl: { type: DataTypes.STRING, allowNull: false },
    targetAudience: { 
        type: DataTypes.ENUM('All', 'Parents', 'Teachers', 'Students'), 
        defaultValue: 'All' 
    }
}, { timestamps: true });

module.exports = Circular;
