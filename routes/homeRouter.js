const express = require('express');
const router = express.Router();
const homeAction = require('../controllers/homeAction');

router.get('/', homeAction.homeRouter_middleware,(req, res)=>{
    res.send(`Welcome`);
})

module.exports = router;