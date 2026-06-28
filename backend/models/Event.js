const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

module.exports = Event;
