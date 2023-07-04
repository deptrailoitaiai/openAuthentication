const connectdb = require('../controllers/server');
const bcrypt = require('bcrypt');
const validator = require('validator');
//const { createClient } = require('redis');
const loginAction = require('../controllers/loginAction');
const registerAction = require('../controllers/registerAction');

async function fgpdRouter_verifyEmail_verifyFunction(email){
    try {
        const pool = await connectdb.connect();
        const request = await pool.request();
        const queries = `SELECT userEmail FROM tbl_users WHERE userEmail = '${email}'`;

        const data = await request.query(queries);
        if(data.recordset == 0){
            throw new Error('email not found');
        }

        //const emailFromDb = data.recordset[0].userEmail;

        // const client = createClient();
        // client.on('error', err => console.log('Redis Client Error', err));
        // await client.connect();
    
        // await client.set('email', `${emailFromDb}`);
        // console.log(await client.get('email'));
        // await client.disconnect();

        return true;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.fgpdRouter_verifyEmail = async function(req, res){
    try {
        const email = req.body.email;
        //console.log(email);
        const emailVerifier = await fgpdRouter_verifyEmail_verifyFunction(email);
        if(emailVerifier === true){
            return {Boolean: true, email: email};
        }
    } catch (error) {
        throw error;
    }
};



module.exports.fgpdRouter_verifyNum_getCode = async function (email){
    try{
        const transporter = await loginAction.loginRouter_contact_nodemailerConfig();

        const randomNumber = await Math.floor(Math.random() * (999999 - 100000 +1)) + 100000;
        console.log(randomNumber);
        const emailContent = `
        <html>
            <head>
                <style>
                    h3, span{
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h3>hello! Good to see you again in this email</h3>
                <span>Seem you have fogotten your password after many times try to log in</span>
                <span>Easy stuff, we can dandle this!</span>
                <span>System will require a 6 digital code: <strong>${randomNumber}</strong></span>
                <span>Hope we will see you in next contact email</span>
            </body>
        </html>
        `;

        const mailOptions = {
            to: email, 
            subject: 'reset password',
            html: emailContent,
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`email sent`);

        return randomNumber;
    }
    catch(err){
        throw err;
    }

};
// done

async function fgpdRouter_verifyNum_codeVerifier(corectCode,postCode){
    try {
        if(corectCode == postCode){
            return true;
        }
        else return false;
    } catch (error) {
        throw error;
    }
};
// done

module.exports.fgpdRouter_verifyNum = async function(req, res){
    try{
        const resultVerrifyNum = await fgpdRouter_verifyNum_codeVerifier(req.session.code,req.body.number);
        //console.log(req.session.code,req.body.number);
        if(resultVerrifyNum == false){
            res.send(`<script>alert('wrong code, try again')</script>`);
            return new Error('verifier code denied');
        }
        return true;
    }
    catch(err){
        throw err;
    }
}



async function fgpdRouter_newPassword_changePassword(email, password) {
    try {
        console.log(`${email}, ${password}`);
        const newPassword = await registerAction.registerRouter_newUser_hashPassword(password);

        const pool = await connectdb.connect();
        const request = await pool.request();
        const queries = `
            UPDATE tbl_users
            SET userPassword = '${newPassword}'
            WHERE userEmail = '${email}';
        `;

        const data = await request.query(queries);
        console.log(`fgpdAction-137: ${data}`);
        
    } catch (error) {
        throw error;
    }
};

module.exports.fgpdRouter_newPassword = async function(req, res){
    try {
        await fgpdRouter_newPassword_changePassword(req.session.email, req.body.newPassword);
        res.redirect('/login');
    } catch (error) {
        throw error;
    }
}

