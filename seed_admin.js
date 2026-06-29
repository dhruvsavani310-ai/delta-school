const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
    }
);

const Admin = sequelize.define('Admin', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'Admin' },
});

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to Aiven MySQL.');
        await sequelize.sync({ alter: true });
        console.log('Tables synced.');

        const email = 'you@gmail.com';
        const password = 'admin123';

        const existing = await Admin.findOne({ where: { email } });
        if (existing) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Admin.create({
            email,
            password: hashedPassword,
            role: 'Super Admin'
        });

        console.log('Admin created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seedAdmin();
