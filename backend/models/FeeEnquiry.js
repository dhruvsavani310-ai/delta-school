const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FeeEnquiry = sequelize.define('FeeEnquiry', {
    parentName: { type: DataTypes.STRING, allowNull: false },
    emailOrPhone: { type: DataTypes.STRING, allowNull: false },
    selectedClass: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT },
    estimatedFee: { type: DataTypes.FLOAT },
    status: {
        type: DataTypes.ENUM('Pending', 'Contacted'),
        defaultValue: 'Pending'
    }
}, { timestamps: true });

module.exports = FeeEnquiry;
