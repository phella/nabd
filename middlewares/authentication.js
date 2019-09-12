const jwt = require('jsonwebtoken');
const tokens = require('../models/token');
const noAuthReuests = [
    '/api/register/user',
    '/api/confirmation',
    '/api/resend_code',
    '/api/login/user',
    '/api/welcome/info'
];
module.exports = async function verifyToken(req,res,next){
    let flag = false;
    noAuthReuests.forEach(el =>{
        if(el === req.url){
        next();
        flag = true;
        }
    });
    if(flag){
        return;
    }
    // get auth header value
    const token = req.headers['token'];
    //check if token is undefined
    if( token === undefined){
        return res.status(403).send({"Error":"unauthorized"});
    }
    else{
        //check if token is in the dp or not 
        
        const result = await tokens.findOne({tokenCode:token},function(err){
            if(err){
                return res.status(400).send({"Error":"something went wrong, please do the procedures correctly"});
            }
        });
        if(!result){
            return res.status(403).send({"Error":"bad token or expired"})
        }
        // check for the token's payload and date
        jwt.verify(token,process.env.SERCETKEY,(err,authData)=>{
            if(err){
                return res.status(403).send({"Error":"unauthorized"});
            }
             else{
                 req._id = authData.phoneNo;
                 next();
                }
        });
    }
}