const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
require("../models/permedic");
const permedic = mongoose.model("permedic");

router.get("/regestration/info", async (req,res) => {
	await permedic.count({}, function(err, count){
		console.log( "Number of docs: ", count );
	});
});