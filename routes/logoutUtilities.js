let tokens = require('../models/token');

async function logout(req,res){
    const token = req.headers['token'];
    if (!token ) {
		return res.status(400).send({ "Error": "Payload is missing" });
    }
	//delete any token in db related to the account
    await tokens.deleteMany({tokenCode:token},function(err){
        if(err){
            return res.status(400).send({"Error":"something went wrong, please do the procedures correctly"});
        }
    });
    return res.status(204).send("Deleted");
}

module.exports = {logout};