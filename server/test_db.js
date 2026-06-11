const { Sequelize } = require('sequelize');
const historyBook = require('./src/models/historyBook.model');
const { connectDB, connect } = require('./src/config/connectDB');

async function test() {
    await connectDB();
    const records = await historyBook.findAll({ limit: 1 });
    console.log(records[0].dataValues);
    process.exit();
}

test();
