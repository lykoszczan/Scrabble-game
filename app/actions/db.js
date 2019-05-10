const mysql = require('./mysql.js');
const options = require('./options.js');

const db = new mysql({
    host: options.storageConfig.host,
    database: options.storageConfig.database,
    port: options.storageConfig.port,
    user: options.storageConfig.user,
    password: options.storageConfig.password
})

module.exports = db;