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
	// to do add better algorithm using ML if possible
	await permedic.find({ $and: [ { rating: { $lt: +req.params.rating+30 } }, { rating: {$gt:+req.params.rating-5} } ] },"name",(err,data)=>{
		permedics = data;
	}).limit(5);
	permedics.sort((a, b) => (Math.abs(a.rating-req.rating) > Math.abs(b.rating-req.rating) ? 1 : -1));
	if(permedics[0].number !== req.params.lastNumber){
		res.json(permedics[0]);
	} else {
		res.json(permedics[1]);
	}
});