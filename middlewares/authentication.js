const jwt = require('jsonwebtoken');
const noAuthReuests = [
    '/api/register/user',
    '/api/confirmation',
    '/api/resend_code',
    '/api/login/user',
    '/api/welcome/info'
];
module.exports = function verifyToken(req,res,next){
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
    //check if bearer is undefined
    if( token === undefined){
        return res.status(403).send({"Error":"unauthorized"});
    }
    else{
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