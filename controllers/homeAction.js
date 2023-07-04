const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.homeRouter_middleware = async function(req, res, next){
    console.log(req)
    
    const jwtCheck = await jwt.verify(req.cookies['client-info'], process.env.JWT_KEY, (err, data)=>{
        if(err){
            console.log(`cant find jwt: ${err}`);
            return false;
        }
        console.log(`homeAction: ${data}`);
    });

    if(jwtCheck == false){
        return res.redirect('/login');
    }

    if(req.cookies['connect.sid'] == undefined){
        console.log('cant recognize session id');
        return res.redirect('/login');
    };

    next();
};