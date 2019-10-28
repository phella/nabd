const patient = require("../models/patient");
const paramedic =require("../models/paramedic");
const doctor = require("../models/doctor");

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

async function findPatient(condition,...projectionArr){
	let result;
	projectionStr = "";
	projectionArr.forEach(el=>{
	projectionStr += el + " ";
	});
	await patient.findOne(condition,projectionStr,(err,res)=>{
		result = res;
	});
	return result;
}

async function findParamedic(condition,...projectionArr){
	let result;
	projectionStr = "";
	projectionArr.forEach(el=>{
	projectionStr += el + " ";
	});
	await paramedic.findOne(condition,projectionStr,(err,res)=>{
		result = res;
	});
	return result;
}

async function findDoctor(condition,...projectionArr){
	let result;
	projectionStr = "";
	projectionArr.forEach(el=>{
	projectionStr += el + " ";
	});
	await doctor.findOne(condition,projectionStr,(err,res)=>{
		result = res;
	});
	return result;
}

module.exports = {addPatient,findPatient,findParamedic,addParamedic,findDoctor,addDoctor};

