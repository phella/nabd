const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const util = require('util');
const redis  = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const socket = require("../services/socket.service");
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
// const binarySearchTree = require("../data-structure/bst");
// bst  = new binarySearchTree();
require("../models/paramedic");
const paramedic = mongoose.model("paramedic");

/**
 * Request paramedic
 * the function uses binary search tree on paramedics
 * @function requestparamedic
 * @memberof module:models~paramedic
 * @this module:models~paramedic
 * 
 * @param rating the prefered rating for the prequested paramedic
 * @param lastphoneNo last contacted paramedic
 * 
 * @return {paramedic} the matched paramedic
 */

module.exports = router.get("/requestParamedic", async (req,res) => {
	const paramedics = JSON.parse( client.hget("online","paramedic"));
	if(!paramedics){
		return res.status(400).json({Error:"No available paramedics"});
	}
	const selected = paramedics.splice(0,20);
	client.hset("online","paramedics",JSON.stringify( paramedics));
	socket.send(selected,req.body.id); 
	return res.status(200).json("Requested Successfully");
});


 /*
module.exports = router.get("/requestparamedic/:rating", async (req,res) => {
	if(req.params.rating < 0 || req.params.rating > 100){
		return res.status(400).json({"Error":"Rating out of range"});
	}	
	let rating = +req.params.rating ; 
	let paramedic = await bst.getparamedic(rating);
	if(paramedic === false){
		return res.status(200).json({"Error":"No avialable paramedics at the moment"});
	}
	return res.status(200).json(paramedic);
});

*/
router.get("/profile/paramedic/:phoneNo" , async (req,res)=>{
	if(req.params.phoneNo.length !== 11 || req.params.phoneNo.substring(0,2) !== "01") {
		res.status(400).json({"Error":"Wrong phone phoneNo format"});
	}
	const profile = await paramedic.findOne({phoneNo:req.params.phoneNo},"bio name phoneNo gender profilePath available")
	.cache({"key":req.params.phoneNo})
	.exec();
	if(!profile) {
		res.status(404).json({"Error":"No such paramedic"});
	} else {
		res.status(200).json(profile);
	}
});