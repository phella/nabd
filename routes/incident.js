const router = require("./index");
const dbManger = require("../services/dbManger");
let incidents = require("../models/incident");



router.post('/incident',async function (req, res) {
    const userID = req.body.userID;
    const description = req.body.description;
    const date = Date.now();
    const image = req.body.image;
    const location = req.body.location;
    const numberToCall = req.body.numberToCall;
    if(!userID)
        return res.status(401).send({ "Error": "No UserId found" });

    let result = await dbManger.findParamedic({ _id: userID });
	if (!result) {
        result = await dbManger.findPatient({ _id: userID });
        if (!result) {
            return res.status(401).send({ "Error": "No account found" });
        }
    }
    
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
        if(err)
            return res.status(400).send({"Error":"somethign went wrong, please make sure you do the procedures right"});
    });
    res.status(200).json(newIncident);
});


router.get('/incident/',async function (req, res) {
    let incid;
    id = req.query.incidentId

    if(id==undefined)
    {
        incid = await incidents.find({}).sort({date:-1}).limit(20);
        if(!incid){
            res.status(404).json({"Error":"No such incident"})
        }
    }
    else{
        
        // get all element 
        incid = await incidents.find({}).sort({date:-1});

        index_of_id = incid.findIndex(x => x._id == id)
        if(index_of_id==-1)
        {
            res.status(404).json({"Error":"No such incident"});
            return 
        }
            
        else{
            //getting 20 element starting from a certain id
            index_of_id++;
            incid = incid.slice(index_of_id,index_of_id+20)
        }
    }
    res.status(200).json(incid);
});


router.delete('/incident/',async function (req, res) {
    id = req.query.incidentId

    if(id==undefined)
    {
        res.status(404).json({"Error":"Id is Required"});
    }
    else{
        // get all element 
        await incidents.deleteOne({_id:id},function(err){
           
            if(err)
            {
                res.status(401).json({"Error":"Something Went Wrong"});
                return 
            }
        })
        res.status(200).json("Deleted Sucessfully")
    }
});