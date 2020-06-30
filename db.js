const Pool = require('pg').Pool;
const db = new Pool({
    database: 'gmdb',
    user: 'gmdb_app',
    password:'123',
    host: 'localhost',
    port: '5433'
})

module.exports = db;