const router = require("./index");
const patient = require('../models/patient');
const permedic = require('../models/permedic');

// need to be in another file
router.get('/welcome/info',async(req,res)=>{
	let numberUsers;
	let numberParamedics = 0;
	await patient.countDocuments({},(err,count)=>{
		numberUsers = count;
		if(err){
			console.log(err);
		}
	});	
	await permedic.countDocuments({},(err,count)=>{
		numberParamedics = count;
		if(err){
			console.log(err);
		}
	});
	return res.status(200).json({numberUsers,numberParamedics,numberDoctors:0,numberAmbulance:0});
});


