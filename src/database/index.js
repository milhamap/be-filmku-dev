const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const knex = require('knex')({
    client: process.env.DB_CLIENT,
    connection: {
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        options: {
            encrypt: true,
            enableArithAbort: true,
            // multipleActiveResultSets: false,
            // trustServerCertificate: false,
            // connectionTimeout: 30,
        },
        port: 1433
    }
})

module.exports = knex;