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
async function fiendPatient(condition){
	let result;
	await patient.findOne(condition,(err,res)=>{
		result = res;
	});
	return result;
}

module.exports = {addPatient};

