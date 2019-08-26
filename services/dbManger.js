const patient = require("../models/patient");
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

module.exports = {addPatient,findPatient};

