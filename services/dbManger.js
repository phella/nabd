const patient = require("../models/patient");
const paramedic =require("../models/paramedic");
const doctor = require("../models/doctor");
const ambulance = require("../models/ambulance");

async function addPatient(account){
    const result = new patient(account);
    let done = true;
    await result.save(function(err){
        if(err){
            done = false;
        }
    });
    return done;
}

async function addParamedic(account){
    const result = new paramedic(account);
    let done = true;
    await result.save(function(err){
        if(err){
            done = false;
        }
    });
    return done;
}

async function addDoctor(account){
    const result = new doctor(account);
    let done = true;
    await result.save(function(err){
        if(err){
            done = false;
        }
    });
    return done;
}

async function addAmbulance(account){
    const result = new ambulance(account);
    let done = true;
    await result.save(function(err){
        if(err){
            done = false;
        }
    });
    return done;
}

async function findPatient(condition,...projectionArr){
	return await find(patient,condition,projectionArr);
}

async function findParamedic(condition,...projectionArr){
	return await find(paramedic,condition,projectionArr);
}

async function findDoctor(condition,...projectionArr){
	return await find(doctor,condition,projectionArr);
}

async function findAmbulance(condition,...projectionArr){
	return await find(ambulance,condition,projectionArr);
}

async function find(model,condition,projectionArr){
	let result;
	projectionStr = "";
	projectionArr.forEach(el=>{
	projectionStr += el + " ";
	});
	await model.findOne(condition,projectionStr,(err,res)=>{
		result = res;
	});
	return result;
}

module.exports = {addPatient,addAmbulance,findPatient,findParamedic,addParamedic,findDoctor,addDoctor,findAmbulance,findDoctor};

