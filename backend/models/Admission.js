const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admission = sequelize.define('Admission', {
    studentName: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    classApplyingFor: { type: DataTypes.STRING, allowNull: false },
    mediumOfInstruction: { 
        type: DataTypes.ENUM('english', 'gujarati'), 
        allowNull: false, 
        defaultValue: 'english' 
    },
    fatherName: { type: DataTypes.STRING, allowNull: false },
    motherName: { type: DataTypes.STRING, allowNull: false },
    mobile: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            is: { args: /^[0-9]{10}$/, msg: 'Please enter a valid 10-digit mobile number' }
        }
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            isEmail: { msg: 'Please enter a valid email address' }
        }
    },
    address: { type: DataTypes.TEXT, allowNull: false },
    studentPhoto: { type: DataTypes.STRING, allowNull: false }, 
    birthCertificate: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
    }
}, { timestamps: true });

module.exports = Admission;
