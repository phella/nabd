const router = require("./index");
const patient = require('../models/patient');
const permedic = require('../models/permedic');

// need to be in another file
router.get('/welcome/info',async(req,res)=>{
	let numberUsers;
	let numberParamedics;
	await patient.countDocuments({},(err,count)=>{
		numberUsers = count;
	});	
	await permedic.countDocuments({},(err,count)=>{
		numberParamedics = count;
	});
	return res.status(200).json({numberUsers,numberParamedics,numberDoctors:0,numberAmbulance:0});
});


