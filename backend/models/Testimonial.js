const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Testimonial = sequelize.define('Testimonial', {
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    quote: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

module.exports = Testimonial;
