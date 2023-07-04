const express = require('express');
const router = express.Router();
const registerAction = require('../controllers/registerAction');
const { hash } = require('bcrypt');

router.get('/', (req, res) => {
    res.render('register', { css: 'register.css', title: 'create one to see our world' });
});

router.post('/', (req, res) => {
    registerAction.registerRouter_newUser(req, res);
});


module.exports = router;
