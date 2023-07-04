const connectdb = require('../controllers/server');
const validator = require('validator');
const bcrypt = require('bcrypt');

async function registerRouter_newUser_save(username, email, password){
    try{
        const pool = await connectdb.connect();
        const request = await pool.request();
        const queries = `INSERT INTO tbl_users(userName, userEmail, userPassword) VALUES ('${username}', '${email}', '${password}')`;

        await request.query(queries, (err,data)=>{
            if(err) console.log(err);
        });
        //console.log('data set');
    } catch(err) {
        throw err;
    } 
} 
//done

async function registerRouter_newUser_validator(email){    
    try {
        const isValidEmail = await validator.isEmail(email);

        if(!isValidEmail){
            return false;
        }
        else return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//done

async function registerRouter_newUser_existedEmail(email){
    try{
        const pool = await connectdb.connect();
        const request = await pool.request();
        const queries = `SELECT userEmail FROM tbl_users WHERE userEmail = '${email}'`;
        
        const data = await request.query(queries);
        if(data.recordset.length == 0){
            return false;
        } else return true;
    } 
    catch(err){
        console.log(err);
        throw err;
    };
}
//done 

module.exports.registerRouter_newUser_hashPassword = async function(password){
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
//done 


module.exports.registerRouter_newUser = async function (req, res) {
    try {
        let inf = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        console.log(inf);

        const validatorCheck = await registerRouter_newUser_validator(inf.email);
        if (!validatorCheck) {
            res.send(`
                <script>
                    alert("email is invalid");
                    window.location.href = '/register';
                </script>
            `);
            throw new Error('validatorCheck');
        }
        
        const existedEmailCheck = await registerRouter_newUser_existedEmail(inf.email);
        console.log(existedEmailCheck);
        if (existedEmailCheck) {
            res.send(`
                <script>
                    alert("email is already in use");
                    window.location.href = '/register';
                </script>
            `);
            throw new Error('existedEmailCheck');
        }

        const hash = await module.exports.registerRouter_newUser_hashPassword(inf.password);
        
        inf.password = hash;

        const save = await registerRouter_newUser_save(inf.username, inf.email, inf.password);
        console.log(`save: ${save}`);
        

        res.redirect('/login');
        
    } catch (error) {
        console.log(error);
    }
}
