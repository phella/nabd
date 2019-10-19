const router = require("./index");
const dbManger = require("../services/dbManger");
let incidents = require("../models/incident");
//const incident = mongoose.model("incident");


router.post('/incident',async function (req, res) {
    const userID = req.body.userID;
    const description = req.body.description;
    const date = req.body.date;
    const image = req.body.image;
    const location = req.body.location;
    const numberToCall = req.body.numberToCall;
    
    // const result = await dbManger.findParamedic({ _id: userID });
	// if (!result) {
	// 	return res.status(401).send({ "Error": "No account found" });
    // }
    // result = await dbManger.findPatient({ _id: userID });
    // if (!result) {
	// 	return res.status(401).send({ "Error": "No account found" });
    // }
    incident = {
        userID,
        description,
        date,
        image,
        location,
        numberToCall
    };
    
    var newIncident = new incidents(incident);
    await newIncident.save(function(err){
        //if(err)
            //return res.status(400).send({"Error":"somethign went wrong, please make sure you do the procedures right"});
    });
    res.status(200).json(newIncident);
});


router.get('/incident/:incidentId',async function (req, res) {
    const incid = await incidents.findOne({_id:req.params.incidentId});
    if(!incid) {
		res.status(404).json({"Error":"No such incident"});
	} else {
		res.status(200).json(incid);
	}
});