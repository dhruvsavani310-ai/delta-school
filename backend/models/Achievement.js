const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Achievement = sequelize.define('Achievement', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    achievedDate: { type: DataTypes.DATE, allowNull: false },
    category: {
        type: DataTypes.ENUM('Academics', 'Sports', 'Arts', 'Co-Curricular'),
        defaultValue: 'Academics'
    }
}, { timestamps: true });

module.exports = Achievement;
