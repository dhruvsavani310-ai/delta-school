const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TopStudent = sequelize.define('TopStudent', {
    name: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: true },
    studentClass: { type: DataTypes.STRING, allowNull: false }, // using studentClass to avoid reserved keyword 'class'
    rank: { type: DataTypes.INTEGER, allowNull: false }, // 1, 2, or 3
    percentage: { type: DataTypes.FLOAT, allowNull: false },
    academic_year: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' }
}, { timestamps: true });

module.exports = TopStudent;
