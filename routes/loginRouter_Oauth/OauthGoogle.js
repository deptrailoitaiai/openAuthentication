const express = require('express');
const router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3030/login/ggAuth/callback', 
}, (accessToken, refreshToken, profile, done) => {
    console.log('User profile:', profile, accessToken, refreshToken);
    done(null, profile);
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', (req, res)=>{
    res.redirect('/abc');
});

module.exports = router;