const express = require('express');
const router = express.Router();
const patient = require('../models/patient');

router.get('register/info',async(req,res)=>{
	let numberPatients;
	await patient.count({},(err,count)=>{
		numberPatients = count;
	});	
	return res.status(200).json({numberPatients});
});


