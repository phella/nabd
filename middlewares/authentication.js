const jwt = require('jsonwebtoken');
const noAuthReuests = [
    '/register/patient',
    '/confirmation',
    '/resend_code',
    '/login',
    'welcome/info'
];
module.exports = function verifyToken(req,res,next){
    noAuthReuests.forEach(el =>{
        if(el === req.url){
            next();
        }
    })
    // get auth header value
    const token = req.headers['token'];
    //check if bearer is undefined
    if( token === undefined){
        res.status(403).send({"Error":"unauthorized"});
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