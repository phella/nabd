const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

require("../models/permedic");
const permedic = mongoose.model("permedic");

/**
 * Request Permedic
 * 
 * @function requestPermedic
 * @memberof module:models~Permedic
 * @this module:models~Permedic
 * 
 * @param rating the prefered rating for the prequested permedic
 * @param lastNumber last contacted permedic
 * 
 * @return {Permedic} the matched permedic
 */
module.exports = router.get("/requestPermedic/:rating/:lastNumber", async (req,res) => {
	let permedics = [];
	if(req.params.rating < 0 || req.params.rating > 100){
		return res.status(400).json({"Error":"Rating out of range"});
	}	
	if(req.params.lastNumber.length !== 11 || req.params.lastNumber.substring(0,2) !== "01") {
		return res.status(400).json({"Error":"Wrong phone number format"});
	}
	// to do add better algorithm using ML if possible
	let rating = +req.params.rating ; 
	while(permedics.length === 0 && rating < 100) {
		permedics = await permedic.find({ $and: [ { rating: { $lt: rating+30 } }, { rating: {$gt:rating-10} },{available:true} ] },"name number")
		.limit(5)
		.exec();
		rating += 30;
	}
	rating = +req.params.rating - 10;
	while(permedics.length === 0 && rating > 0) {
		permedics = await permedic.find({ $and: [ { rating: { $lt: rating+30 } }, { rating: {$gt:rating-10} },{available : true }] },"name number")
		.limit(5)
		.exec();
		rating -= 10;
	}
	if(permedics.length === 0) {
		return res.status(200).json({"Error" :"No available permedics at the moment"});
	}
	permedics.sort((a, b) => (Math.abs(a.rating-req.params.rating) > Math.abs(b.rating-req.params.rating) ? 1 : -1));
	if(permedics[0].number != req.params.lastNumber || permedics.length === 1 ){
		return res.status(200).json(permedics[0]);
	} else {
		return res.status(200).json(permedics[1]);
	}
});


router.get("/profile/permedic/:number" , async (req,res)=>{
	if(req.params.number.length !== 11 || req.params.number.substring(0,2) !== "01") {
		res.status(400).json({"Error":"Wrong phone number format"});
	}
	const profile = await permedic.findOne({number:req.params.number},"bio name number gender profilePath available")
	.cache({"key":req.params.number})
	.exec();
	if(!profile) {
		res.status(404).json({"Error":"No such permedic"});
	} else {
		res.status(200).json(profile);
	}
});