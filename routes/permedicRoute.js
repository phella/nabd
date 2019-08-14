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
	let permedics;
	if(req.rank < 0 || req.rank > 100){
		res.status(400).json("Rank out of range");
	}
	// to do add better algorithm using ML if possible
	await permedic.find({ $and: [ { rating: { $lt: +req.params.rating+30 } }, { rating: {$gt:+req.params.rating-5} } ] },"name",(err,data)=>{
		permedics = data;
	}).limit(5);
	if(permedics === []) {
		await permedic.find({},"name",(err,data)=>{
			permedics = data;
			if(permedics === []) {
				res.status(200).json("no available permedics at the moment");
			}
		});
	}
	permedics.sort((a, b) => (Math.abs(a.rating-req.rating) > Math.abs(b.rating-req.rating) ? 1 : -1));
	if(permedics[0].number !== req.params.lastNumber){
		res.status(200).json(permedics[0]);
	} else {
		res.status(200).json(permedics[1]);
	}
});