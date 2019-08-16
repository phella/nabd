module.exports = function verifyToken(req,res,next){
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
                 console.log(authData);
                 req._id = authData.phoneNo;
                }
        });
        next();
    }
}

