const jwt = require('jsonwebtoken');
const dbManger = require("../services/dbManger");
const bcrypt = require('bcrypt');
let tokens = require('../models/token');

async function login(req, res , find) {
	const phoneNo = req.body.phoneNo;
	const password = req.body.password;
	if (!phoneNo || !password) {
		return res.status(400).send({ "Error": "Payload is missing" });
	}
	// More logic to be added
	const result = await find({ _id: phoneNo });
	if (!result) {
		return res.status(401).send({ "Error": "No account found" });
	}
	// compare password with the hashed password in db
	bcrypt.compare(password, result.password, function (err, match) {
		if (err) {
			return res.status(409).send({ "Error": "Something went wrong, please check that you do the procedures correctly" });
		}
		if (!match) {
			return res.status(401).send({ "Error": "Wrong password" });
		}
	});
	//delete any token in db related to the account
	await tokens.deleteMany({_id:phoneNo});

	var user = {
		_id:phoneNo,
		password
	};
	jwt.sign(user, process.env.SERCETKEY, { expiresIn: '864000s'/**10days*/ }, async (err, token) => {
		if (err) {
			return res.status(409).send({ "Error": "Try again later" });
		}
		else {
			// save the token in db
			userToken = {
				_id:phoneNo,
				tokenCode:token
			}
			var newToken = new tokens(userToken);
			await newToken.save(function(err){
				if(err)
					return res.status(400).send({"Error":"somethign went wrong, please make sure you do the procedures right"});
			});
			// return token
			return res.status(201).json({
				token
			});
		}
	})
}

module.exports = {login};