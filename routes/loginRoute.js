const router = require("./index");
const jwt = require('jsonwebtoken');
const dbManger = require("../services/dbManger");
const bcrypt = require('bcrypt');

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
			return res.status(409).send({ "Error": "Try again later" });
		}
		if (!match) {
			return res.status(401).send({ "Error": "Wrong password" });
		}
	});
	const user = {
		phoneNo: phoneNo,
		password: password
	};
	jwt.sign(user, process.env.SERCETKEY, { expiresIn: '864000s'/**10days*/ }, (err, token) => {
		if (err) {
			return res.status(409).send({ "Error": "Try again later" });
		}
		else {
			return res.status(201).json({
				token
			});
		}
	})
}

module.exports = {login};