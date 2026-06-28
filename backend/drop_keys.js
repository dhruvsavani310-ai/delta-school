const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'delta_school',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');
        const [results] = await sequelize.query(`SHOW INDEX FROM SiteContents`);
        const indexNames = [...new Set(results.map(r => r.Key_name))].filter(name => name !== 'PRIMARY');
        
        for (const indexName of indexNames) {
            console.log(`Dropping index ${indexName}`);
            await sequelize.query(`ALTER TABLE SiteContents DROP INDEX \`${indexName}\``);
        }
        console.log('All extra indexes dropped successfully.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sequelize.close();
    }
}

run();
