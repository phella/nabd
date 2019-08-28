const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const binarySearchTree = require("../data-structure/bst");
bst  = new binarySearchTree();
require("../models/permedic");
const permedic = mongoose.model("permedic");

/**
 * Request Permedic
 * the function uses binary search tree on permedics
 * @function requestPermedic
 * @memberof module:models~Permedic
 * @this module:models~Permedic
 * 
 * @param rating the prefered rating for the prequested permedic
 * @param lastphoneNo last contacted permedic
 * 
 * @return {Permedic} the matched permedic
 */
module.exports = router.get("/requestPermedic/:rating", async (req,res) => {
	if(req.params.rating < 0 || req.params.rating > 100){
		return res.status(400).json({"Error":"Rating out of range"});
	}	
	let rating = +req.params.rating ; 
	let permedic = await bst.getPermedic(rating);
	if(permedic === false){
		return res.status(200).json({"Error":"No avialable permedics at the moment"});
	}
	return res.status(200).json(permedic);
});


router.get("/profile/permedic/:phoneNo" , async (req,res)=>{
	if(req.params.phoneNo.length !== 11 || req.params.phoneNo.substring(0,2) !== "01") {
		res.status(400).json({"Error":"Wrong phone phoneNo format"});
	}
	const profile = await permedic.findOne({phoneNo:req.params.phoneNo},"bio name phoneNo gender profilePath available")
	.cache({"key":req.params.phoneNo})
	.exec();
	if(!profile) {
		res.status(404).json({"Error":"No such permedic"});
	} else {
		res.status(200).json(profile);
	}
});