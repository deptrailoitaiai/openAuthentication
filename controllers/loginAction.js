const connectdb = require('../controllers/server');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

async function loginRouter_authentication_validator(email){
    try {
        const isValidEmail = await validator.isEmail(email);

        if(!isValidEmail){
            return false;
        } else return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
//done

async function loginRouter_authentication_findEmail(email){
    try {
        const pool = await connectdb.connect();
        const request = await pool.request();
        const queries = `SELECT userEmail, userPassword FROM tbl_users WHERE userEmail = '${email}'`;

        const data = await request.query(queries);

        if(data.recordset == 0){
            throw new Error('email not found');
        }
        // const emailFromDb = data.recordset[0].userEmail;
        // const passwordFromBody = data.recordset[0].userPassword;
        // console.log(passwordFromBody);
        // console.log(emailFromDb);
        const infFromDb = {
            emailFromDb: data.recordset[0].userEmail,
            hash: data.recordset[0].userPassword,
        }
        return infFromDb;
    } catch (error) {
        if(error.message === 'email not found'){
            return false;
        }
        else {
            console.log(error);
            throw error;
        };
    }
}
//done

async function loginRouter_authentication_hashCompare(passwordFromBody, hash){
    try{
        const passwordVerifier = bcrypt.compare(passwordFromBody, hash);
        return passwordVerifier;
    } 
    catch (error){
        console.log(error);
        throw error;
    }
}
//done

async function loginRouter_authentication_jwtToken(email){
    try{
        const accessToken = jwt.sign({email: email}, process.env.JWT_KEY);
        return accessToken;
    }
    catch(error){
        console.log(error);
        throw error
    }
}
//done

module.exports.loginRouter_authentication = async function(req, res){
    try{
        let post_inf = {
            email: req.body.email,
            password: req.body.password,
        };
        //console.log(`post_inf: ${post_inf}`);

        if(post_inf.email == undefined || post_inf.password == undefined){
            return;
        }

        const response = await loginRouter_authentication_validator(post_inf.email);
        //console.log(`response: ${response}`);
        if(response == false){
            res.send(`
            <script>
                alert('email is invalid');
                window.location.href = '/login';
            </script>
            `)
            throw new Error('invalid email');
        };

        const infFromDb = await loginRouter_authentication_findEmail(post_inf.email);
        console.log(`infFromDb: ${infFromDb}`);
        if(infFromDb == false){
            res.send(`
            <script>
                alert('email not found');
                window.location.href = '/login';
            </script>
            `);
            throw new Error('email not found');
        };

        const compare = await loginRouter_authentication_hashCompare(post_inf.password, infFromDb.hash);
        //console.log(`compare: ${compare}`);
        if(compare == false){
            res.send(`
            <script>
                alert('password is incorect');
                window.location.href = '/login';
            </script>
            `)
            throw new Error('password is incorrect');
        };

        const accessToken = await loginRouter_authentication_jwtToken(infFromDb.emailFromDb);
        
        await res.cookie("client-info", `${accessToken}`, { maxAge: 3600000 });
        //console.log('cookie sent');

        // req.session.accessToken = accessToken;
        // console.log(req.session.accessToken);
        // sessionID

        res.redirect('/home');
    }
    catch(err){
        console.log(err);
    }
}


module.exports.loginRouter_contact_nodemailerConfig = async function(){
    try {
        const GOOGLE_MAILER_CLIENT_ID = process.env.CLIENT_ID;
        const GOOGLE_MAILER_CLIENT_SECRET = process.env.CLIENT_SECRET;
        const GOOGLE_MAILER_REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const ADMIN_EMAIL_ADDRESS = process.env.EMAIL;

        const myOAuth2Client = new OAuth2Client(
            GOOGLE_MAILER_CLIENT_ID,
            GOOGLE_MAILER_CLIENT_SECRET,
        );

        myOAuth2Client.setCredentials({
            refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
        });

        const myAccessTokenObject = await myOAuth2Client.getAccessToken();

        const myAccessToken = myAccessTokenObject?.token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: ADMIN_EMAIL_ADDRESS,
              clientId: GOOGLE_MAILER_CLIENT_ID,
              clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
              refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
              accessToken: myAccessToken
            }
        });

        return transporter;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports.loginRouter_contact = async function(req, res){
    try{
        const contact_name = req.body.contact_name;
        const contact_email = req.body.contact_email;

        if(contact_name == undefined || contact_email == undefined){
            return;
        }

        const transporter = await module.exports.loginRouter_contact_nodemailerConfig();

        const mailOptions = {
            to: contact_email, 
            subject: 'contact email',
            html: `
            <h3>hello ${contact_name} !</h3>
            <span>We have received your email and will give you information about us as soon as possible</span>
            ` 
        };
        console.log(contact_email);
        await transporter.sendMail(mailOptions);
        //res.send(`<script>alert('we got your email, thanks for being our customers')</script>`);
        res.redirect('/login');   // err cannot set headers 
        console.log('mail sent successfully');
    }
    catch(err){
        console.log(err);
    }
};