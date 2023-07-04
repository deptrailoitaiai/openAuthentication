const express = require('express');
const router = express.Router();
const ggAuth = require('../routes/loginRouter_Oauth/OauthGoogle');
const loginAction = require('../controllers/loginAction');

router.get('/', (req,res) =>{
    res.render('login', {css: 'login.css', js: 'login.js', title: 'Dotcar - Buy any car you want'});
});

router.post('/', (req, res) => {
    loginAction.loginRouter_authentication(req, res);
    loginAction.loginRouter_contact(req,res);
});

router.use('/ggAuth', ggAuth);

module.exports = router;