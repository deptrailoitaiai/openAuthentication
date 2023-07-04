const express = require('express');
const router = express.Router();
const fgpdAction = require('../controllers/fgpdAction');

router.use(express.static('public/css'));
router.use(express.static('public/js'));
router.use(express.static('public/img'));

router.get('/verifyEmail', (req, res)=>{
    res.render('fgpd_verifyEmail', {css: 'fgpd.css', title: 'Reset Password - Step 1: Enter Email'});
});

router.post('/verifyEmail', async (req, res)=>{
    try{
        const emailVerifier = await fgpdAction.fgpdRouter_verifyEmail(req, res);
        if(emailVerifier.Boolean === true){
            req.session.email = await emailVerifier.email;
            //console.log(req.emailResetPassword);
            req.session.emailVerified = true;
            //console.log(req.session.emailVerified, req.body.email);  
            return res.redirect('/fgpd/verifyNum');
        }
        return;
        
    }
    catch(err){
        console.log(err);
    };
});


router.get('/verifyNum', async (req, res)=>{
    try{
        //console.log(req.session.emailVerified);
        if(req.session.emailVerified == true){
            const code = await fgpdAction.fgpdRouter_verifyNum_getCode(req.session.email);
            req.session.code = code;
            return res.render('fgpd_verifyNum', {css: 'fgpd_verifyNum.css', title:'Enter a 6-digit number'});
        };
        
        res.redirect('/fgpd/verifyEmail');
    }
    catch(err){
        console.log(err);
    }
});

router.post('/verifyNum', async (req, res)=>{
    try{
        delete req.session.emailVerified;
        const codeVerrifier = await fgpdAction.fgpdRouter_verifyNum(req, res);
        console.log(codeVerrifier);
        if(codeVerrifier == true){
            req.session.codeVerrifier = true;
            return res.redirect('/fgpd/newPassword');
        }
        return;
    }
    catch(err){
        console.log(err);
    };
});


router.get('/newPassword', (req, res)=>{
    console.log(req.session);
    if(req.session.codeVerrifier == true){
        return res.render('fgpd_newPassword', {css: 'fgpd.css', title: 'Reset Password - Step 2: Create New Password'});
    }

    res.redirect('/fgpd/verifyEmail');
});

router.post('/newPassword', async (req, res)=>{
    try{
        delete req.session.codeVerrifier;
        console.log(req.body);
        await fgpdAction.fgpdRouter_newPassword(req, res);
    }
    catch(err){
        console.log(err);
    };
});


module.exports = router;