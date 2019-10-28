const jwt = require('jsonwebtoken');
const dbManger = require("../services/dbManger");
const bcrypt = require('bcrypt');
let tokens = require('../models/token');

const redis  = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

async function login(req, res ) {
	const phoneNo = req.body.phoneNo;
	const password = req.body.password;
	if (!phoneNo || !password) {
		return res.status(400).send({ "Error": "Payload is missing" });
	}
	
	let result = await dbManger.findParamedic({ _id: phoneNo },"name","password");
	let type;
	if(result){
		type = "Paramedic";
	}else{
		result = await dbManger.findPatient({ _id: phoneNo },"name","password");
		if(result)
			type = "Patient";
	}
	if(!result){
		result = await dbManger.findAmbulance({ _id: phoneNo },"name","password");
		if(result)
			type = "Ambulance";
	}
	if(!result){
		result = await dbManger.findDoctor({ _id: phoneNo },"name","password");
		type = "Doctor";
	}
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
					return res.status(400).send({"Error":"somethiNG went wrong, please make sure you do the procedures right"});
			});
			if(type)
				client.hset("ready",phoneNo,type);
			// return token
			return res.status(201).json({
				token,
				"userName":result.name
			});
		}
	})
}

module.exports = {login};
