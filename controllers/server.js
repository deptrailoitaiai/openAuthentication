const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DATABASE,
    driver: 'msnodesqlv8',
}

async function connect() {
    try {
        const pool = await new sql.ConnectionPool(config).connect();
        console.log('connected');
        return pool;
    }
    catch (error) {
        console.log(error);
    } 
}
connect()


module.exports = {connect :connect}


