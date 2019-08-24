const router = require("./index");
const bcrypt =  require('bcrypt');
const randomstring = require("randomstring");
const dbManger = require("../services/dbManger");
const redis = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const util = require("util");
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
// to send SMS
 const Nexmo = require('nexmo');

 const nexmo = new Nexmo({
   apiKey: process.env.APIKEY,
   apiSecret: process.env.APISECRET,
 });

 let patient = require('../models/patient');

 router.post('/register/user',async function (req, res) {
    const name = req.body.name;
    const phoneNo = req.body.phoneNo;
    const birthDate = req.body.birthDate;
    const gender = req.body.gender;
    const password = req.body.password;

    //check if the number is valid
    if (!phoneNo || isNaN(+phoneNo) || phoneNo.length !== 12 || phoneNo.substring(0, 3) !== "201") {
       return res.status(400).json({ "Error": "Wrong phone number format" });
    };
    const numberPre = await numberPredefined(phoneNo);  
    if(numberPre){
        return res.status(409).json({"Error":"Account for phone number already exists"});
    }

    //check if something is missing in the payload
    if (name === null || birthDate === null || gender === null || password === null) {
        return res.status(400).json({ "Error": "Payload is missing" });
    }
    const randomCode = randomstring.generate(8);
    let newAccount = new patient({
        name,
        birthDate,
        gender,
        password,
        _id:phoneNo,
        randomCode
	});
	hashPasswords(newAccount);
    const result = await client.get(phoneNo);
	if(result){
		return res.status(409).json({"Error":"Account is created and needs confirmation"});
    }
    // Save info in redis
    client.set(phoneNo,JSON.stringify(newAccount),"EX",60*60);
    
    // Send Random number
    const from = 'Server';
    const to = newAccount._id;
    const text = `Code for verification is : ${randomCode}`;
    //nexmo.message.sendSms(from, to, text);
	return res.status(201).json("created successfully");
});

async function hashPasswords(newAccount) {
    //hashing password before storing in db
    const saltRounds = 10;
    await bcrypt.hash(newAccount.password, saltRounds, function (err, hash) {
        newAccount.password = hash;
	});
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
    const result = Json.parse(client.get(phoneNo));
    if(result.randomCode === randomCode) {
        delete result.randomCode;
        client.del(phoneNo);
        // More logic to be added 
        if(result.hasOwnProperty('_id')){
            if(!dbManger.addPatient(result)){
                return res.status(202).json({"Error":"Try again later"})
            }
        }
        return res.status(201).json("Account activated");
    } else {
        return res.status(404).json({"Error":"Not found"});
    }
});


router.post('/resend_code', async (req, res) => {
    const phoneNo = req.body.phoneNo;
    const result = await client.get(phoneNo);
    if(result){
        const randomCode = randomstring.generate(8);
        result.randomCode = randomCode;
        const from = 'Server';
        const to = `2 +${newAccount._id}`;
        const text = `Code for verification is : ${randomCode}`;
        //nexmo.message.sendSms(from, to, text);
        console.log(randomCode);
        client.set(phoneNo,result,"EX",60*60);
        return res.status(201).json("New confirmation code sent");
    } else {
        return res.status(404).json({"Error":"Sign up first"});
    }
});

async function numberPredefined(phoneNo){
    let flag = false;
    /*await patient.find({_id:phoneNo},(err,res)=>{
        if(res.length !== 0){
            flag = true;
            console.log(res);
        }
    });*/
    return false;
}