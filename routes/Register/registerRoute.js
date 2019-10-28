const router = require("../index");
const bcrypt =  require('bcrypt');
const dbManger = require("../../services/dbManger");
const redis = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const util = require("util");
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
client.get = util.promisify(client.get);
bcrypt.hash = util.promisify(bcrypt.hash);

// to send SMS
 const Nexmo = require('nexmo');

 const nexmo = new Nexmo({
   apiKey: process.env.APIKEY,
   apiSecret: process.env.APISECRET,
 });

// Models
const patient = require('../../models/patient');
const paramedic = require('../../models/paramedic');
const doctor = require('../../models/doctor'); 
const ambulance = require('../../models/ambulance');

 async function register(req,res,type){
    const name = req.body.name;
    const phoneNo = req.body.phoneNo;
    const birthDate = req.body.birthDate;
    const gender = req.body.gender;
    const password = req.body.password;
    // For paramedics and doctors
    const rating  = req.body.rating;
    // For doctors
    const specialization = req.body.specialization;

    //check if the number is valid
    if (!phoneNo || isNaN(+phoneNo) || phoneNo.length !== 12 || phoneNo.substring(0, 3) !== "201") {
       return res.status(400).json({ "Error": "Wrong phone number format" });
    };
    const numberPre = await numberPredefined(phoneNo);  
    if(numberPre){
        return res.status(409).json({"Error":"Account for phone number already exists"});
    }

    //check if something is missing in the payload
    if (!name || !birthDate || !password ) {
        return res.status(400).json({ "Error": "Payload is missing" });
    }
    const randomCode =Math.random().toString().substring(2,6);
    let newAccount = {
        name,
        birthDate,
        gender,
        password,
        _id:phoneNo,
        randomCode,
        rating,
        specialization
    };
    newAccount.password = await hashPasswords(newAccount);
    console.log(newAccount);
    const result = await client.get(phoneNo);
	if(result){
		return res.status(409).json({"Error":"Account is created and needs confirmation"});
    }
    // Save info in redis
    client.hset(phoneNo,"confirmation",JSON.stringify(newAccount));

    // Send Random number
    const from = 'Server';
    const to = newAccount._id;
    const text = `Code for verification is : ${randomCode}`;
    nexmo.message.sendSms(from, to, text);
	return res.status(201).json("created successfully");
}

async function hashPasswords(newAccount) {
    //hashing password before storing in db
    let hashed;
    const saltRounds = 10;
    hashed = await bcrypt.hash(newAccount.password, saltRounds);
    return hashed;
}


router.post('/confirmation', async (req, res) => {
    const phoneNo = req.body.phoneNo;
    const randomCode = req.body.randomCode;

    //check if the number is valid
    if (!phoneNo || isNaN(+phoneNo) || phoneNo.length !== 12 || phoneNo.substring(0, 3) !== "201") {
        return res.status(400).send({ "Error": "Wrong phone number format" });
    }
    //check if code is valid
    if (!randomCode) {
        return res.status(400).send({ "Error": "Wrong code format" });
    }
    const result = JSON.parse(await client.hget(phoneNo,"confirmation"));
    console.log(result);
    if(result.randomCode === randomCode) {
        delete result.randomCode;
        let account;
        if(!result.rating){
            account = new patient(result);
            dbManger.addPatient(account);
        } else if(!result.specialization){
            if(result.rating){ 
                account = new paramedic(result);
                dbManger.addParamedic(account);
            } else {
                account = new ambulance(result);
                dbManger.addParamedic(account);
            }
        } else {
            account = new doctor(result);
            dbManger.addDoctor(account);
        }
        client.hdel(phoneNo,"confirmation");
        return res.status(201).json("Account activated");
    } else {
        return res.status(404).json({"Error":"Not found"});
    }
});


router.put('/resend_code', async (req, res) => {
    const phoneNo = req.body.phoneNo;
    const result = await client.get(phoneNo);
    if(result){
        const randomCode = Math.random().toString().substring(2,6);
        result.randomCode = randomCode;
        const from = 'Server';
        const to = newAccount._id;
        const text = `Code for verification is : ${randomCode}`;
        nexmo.message.sendSms(from, to, text);
        client.set(phoneNo,result,"EX",60*60);
        return res.status(201).json("New confirmation code sent");
    } else {
        return res.status(404).json({"Error":"Sign up first"});
    }
});

async function numberPredefined(phoneNo){
    let result = await dbManger.findParamedic({_id:phoneNo});
    if(result){ 
        return true;
    }
    result = await dbManger.findPatient({_id:phoneNo});
    if(result)
        return true;
    result = await dbManger.findDoctor({_id:phoneNo});
    if(result)
        return true;
    result = await dbManger.findAmbulance({_id:phoneNo});
    if(result)
        return true;
    return false;
}

router.get('/welcome/info',async(req,res)=>{
	let numberUsers;
	let numberParamedics = 0;
	await patient.countDocuments({},(err,count)=>{
		numberUsers = count;
		if(err){
			console.log(err);
		}
	});	
	await paramedic.countDocuments({},(err,count)=>{
		numberParamedics = count;
		if(err){
			console.log(err);
		}
	});
	return res.status(200).json({numberUsers,numberParamedics,numberDoctors:0,numberAmbulance:0});
});

module.exports = {register};