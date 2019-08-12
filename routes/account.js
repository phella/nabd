const express = require('express');
const router = express.Router();
const bcrypt =  require('bcrypt');
const randomstring = require("randomstring");
require('dotenv').config();

// to send SMS
 const Nexmo = require('nexmo');

 const nexmo = new Nexmo({
   apiKey: process.env.APIKEY,
   apiSecret: process.env.APISECRET,
 });


const {check, validationResult} = require('express-validator');

let account = require('../models/account');
let code = require('../models/code');
let credentials = require('../models/credentials');



// Register route
router.post('/register', function (req, res) { 
    const name = req.body.name;
    const phoneNo = req.body.phoneNo;
    const age = Number(req.body.age);
    const gender = req.body.gender;
    const password = req.body.password;
    const passwordCheck = req.body.passwordCheck;

    //check if the number is valid
    if (isNaN(phoneNo) || phoneNo.length != 11 || (phoneNo.substring(0,3)!="010" &&phoneNo.substring(0,3) != "011" && phoneNo.substring(0,3) != "012") || phoneNo==null )
    {
        res.status(400).send({"Error":"Wrong phone number format"});
        return;
    }
    //check if password match
    if(password!==passwordCheck)
    {
        res.status(409).send({"Error":"Password does not match"});
        return;
    }

    //check if something is missing in the payload
    if(name ==null || age == null || gender == null || password == null || passwordCheck == null)
    {
        res.status(400).send({"Error":"Payload is missing"});
        return;
    } 
    // creating new document
    let newAccount = new account({
        name:name,
        phoneNo:phoneNo,
        password:password,        
        age:age,
        gender:gender,
    })

    //hashing password before storing in db
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        newAccount.password = hash;
        if(err){
            res.status(409).send(err);
            return;
        }
        newAccount.save(function(err){
            if(err){
                res.status(409).send(err);
            }
            else{
                // generating random code for verification
                const randomCode = randomstring.generate(8);
                // storing code in database
                var thisMoment = new Date();
                thisMoment.setMinutes(thisMoment.getMinutes() + 5 ); // adding 5mins for date to expire
                let  newCode = new code({
                    code:randomCode,
                    phoneNo:phoneNo,
                    expirationDate:thisMoment
                })
                newCode.save(function(err){
                    if(err){
                        res.status(409).send(err);
                    }
                })
                // deleting any expirated code
                code.deleteMany({expirationDate:{$lt:Date.now()}},function(err){
                    if(err){
                        res.status(409).send(err);
                    }
                })
                // creating new account but still not activated
                let newCredentials = new credentials({
                    phoneNo:phoneNo,
                    password:newAccount.password,
                    isActivated:false
                })
                newCredentials.save(function(err){
                    if(err){
                        res.status(409).send(err);
                    }
                    else{
                        res.status(201).send("Created Successfully");
                    }
                })
                const from = 'Server';
                const to = '2'+ phoneNo;
                const text = `Code for verification is : ${randomCode}`;
                //nexmo.message.sendSms(from, to, text);
            }
        });
    });

});



router.put('/confirmation', async(req,res) =>{
    const phoneNo = req.body.phoneNo;
    const randomCode = req.body.randomCode;
    
    var flag = false;
    //check if the number is valid
    if (isNaN(phoneNo) || phoneNo.length != 11 || (phoneNo.substring(0,3)!="010" &&phoneNo.substring(0,3) != "011" && phoneNo.substring(0,3) != "012") || phoneNo==null )
    {
        res.status(400).send({"Error":"Wrong phone number format"});
        return;
    }
    //check if code is valid
    if(randomCode == null)
    {
        res.status(400).send({"Error":"Wrong code format"});
        return;
    }
    await code.find({phoneNo:phoneNo, code:randomCode},function(err,exist){
        if(err){
            res.status(409).send(err);
            flag =true;
            return;
        }
        //check if code or phoneNo exists
        if(exist.length==0){
            res.status(409).send({"Error":"Code or phoneNo does not exist"});
            flag =true;
            return;
        }
        // check if date is expired
        if(exist[0].expirationDate < Date.now() )
        {
            code.deleteMany({expirationDate:{$lt:Date.now()}},function(err){
                if(err){
                    res.status(409).send(err);
                    flag =true;
                    return;
                }
            })
            res.status(409).send({"Error":"Code date is expired"});
            flag =true;
            return;
        }
    })
    if(flag == true)
        return;
    credentials.updateOne({phoneNo:phoneNo},{$set:{isActivated:true}},function(err){
        if(err){
            res.status(409).send(err);
            flag=true;
            return;
        }    
    })
    if(flag==true)
        return;
    // delete after using the code
    code.deleteMany({phoneNo:phoneNo,code:randomCode},function(err){
        if(err){
            res.status(409).send(err);
            flag=true;
            return;
        }
    })
    if(flag==true)
        return;
    res.status(200).send("OK");
});



router.post('/resend_code', async (req,res)=> {
    const phoneNo = req.body.phoneNo;
    //check if the number is valid
    if (isNaN(phoneNo) || phoneNo.length != 11 || (phoneNo.substring(0,3)!="010" &&phoneNo.substring(0,3) != "011" && phoneNo.substring(0,3) != "012") || phoneNo==null )
    {
        res.status(400).send({"Error":"Wrong phone number format"});
        return;
    }
    var flag = false;
    //check if phoneNo exist           
    await credentials.find({phoneNo:phoneNo},function (err,exist){
        if(err)
        {
            res.status(409).send(err);
            flag=true;
            return;
        }
        if(exist.length == 0)
        {
            flag =true;
            res.status(409).send({"Error":"phoneNo does not exist"});
        }
    })
    if(flag == true)
        return;
    //delete any previous exsiting code
    code.deleteMany({phoneNo:phoneNo},function(err){
        if(err){
            res.status(409).send(err);
            flag=true;
            return;
        }
    })
    if(flag==true)
        return;
    // generating random code for verification
    const randomCode = randomstring.generate(8);
    // storing code in database
    var thisMoment = new Date();
    thisMoment.setMinutes(thisMoment.getMinutes() + 5 ); // adding 5mins for date to expire
    let  newCode = new code({
        code:randomCode,
        phoneNo:phoneNo,
        expirationDate:thisMoment
    })
    newCode.save(function(err){
        if(err){
            res.status(409).send(err);
            flag=true;
            return ;
        }
    })
    res.status(201).send("Created Successfully");
});

module.exports = router;