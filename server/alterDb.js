require('dotenv').config();
const { connect } = require('./src/config/connectDB');

const alterTable = async () => {
    try {
        await connect.query(`ALTER TABLE historyBooks MODIFY COLUMN status ENUM('pending', 'success', 'cancel', 'picked_up') NOT NULL DEFAULT 'pending';`);
        console.log('Altered table successfully');
    } catch (e) {
        console.log('Error altering table: ', e);
    }
    process.exit();
}

alterTable();
