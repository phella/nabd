const router = require("./index");
const patient = require('../models/patient');
const permedic = require('../models/permedic');

// need to be in another file
router.get('/welcome/info',async(req,res)=>{
	let numberPatients,numberPermedics;
	await patient.countDocuments({},(err,count)=>{
		numberPatients = count;
	});	
	await permedic.countDocuments({},(err,count)=>{
		numberPermedics = count;
	});
	return res.status(200).json({numberPatients,numberPermedics});
});


