module.exports = function verifyToken(req,res,next){
    // get auth header value
    const header = req.headers['token'];
    //check if bearer is undefined
    if(typeof header === 'undefined'){
        res.status(403).send({"Error":"unauthorized"});
    }
    else{
        req.token = header;
        next();
    }
}

