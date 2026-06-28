const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enquiry = sequelize.define('Enquiry', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Please enter a valid email address' }
        }
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: { args: /^[0-9]{10}$/, msg: 'Please enter a valid 10-digit mobile number' }
        }
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
        type: DataTypes.ENUM('Pending', 'Reviewed', 'Resolved'),
        defaultValue: 'Pending'
    }
}, { timestamps: true });

module.exports = Enquiry;
