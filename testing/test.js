const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'LAPTOP-2S9ODRJK\\SQLEXPRESS',
    user: 'sa',
    password: 'minhthongminh123',
    database: 'OpenAuthentication_RESTfulAPI',
    driver: 'msnodesqlv8',
};

async function connect() {
    try {
        const pool =  await new sql.ConnectionPool(config);
        await pool.connect();
        console.log("connected");
        let result

        const queries = `SELECT userEmail FROM tbl_users WHERE userEmail = 'minh0912873465@gmail.com'`;
        const request = await pool.request();
        const data = await request.query(queries);
        console.log(data.recordset);
        
        
    }
    catch (error) {
        console.log(error);
    }
}
connect()



//query(`INSERT INTO tbl_user VALUES ('1001', 'minh', 'minh0912873465@gmail.com', 'minh123')`);