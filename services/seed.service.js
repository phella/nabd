const mongoose = require('mongoose');
require("../models/permedic");
const permedic = mongoose.model("permedic");
const jwt = require('jsonwebtoken');
let tempTokens = [];


 function populatePermedics(permedics) {
	permedic.deleteMany({},(err,result)=>{
	});
	permedics.forEach(element => {
		jwt.sign({"phoneNo":element.number,"password":element.password},process.env.SERCETKEY,(err,token)=>{
			tempTokens.push(token);
		});
		let add = new permedic(element);
		add.save();
	});
	// needs refactor
	 return tempTokens;
}

module.exports = {populatePermedics};