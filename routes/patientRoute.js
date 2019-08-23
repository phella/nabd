const express = require('express');
const router = express.Router();
const patient = require('../models/patient');
const permedic = require('../models/permedic');

// need to be in another file
router.get('welcome/info',async(req,res)=>{
	let numberPatients,numberPermedics;
	await patient.count({},(err,count)=>{
		numberPatients = count;
	});	
	await permedic.count({},(err,count)=>{
		numberPermedics = count;
	});
	return res.status(200).json({numberPatients,numberPermedics});
});


