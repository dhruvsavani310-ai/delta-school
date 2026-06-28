const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteContent = sequelize.define('SiteContent', {
    key: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING },
    text: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    subtitle: { type: DataTypes.STRING },
    extraData: {
        type: DataTypes.TEXT,
        get() {
            const val = this.getDataValue('extraData');
            try {
                return val ? JSON.parse(val) : {};
            } catch (e) {
                return {};
            }
        },
        set(val) {
            this.setDataValue('extraData', val ? JSON.stringify(val) : null);
        }
    }
}, { 
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['key'],
            name: 'site_content_key_unique'
        }
    ]
});

module.exports = SiteContent;
