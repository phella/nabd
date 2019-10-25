const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

// code Schema for incident activation 
const incidentSchema = mongoose.Schema({
    userID : {
        type: String,
        require : true,
        min: 11,
        max: 11
    },
    description : {
        type: String,
    },
    date : {
        type: Date,
    },
    image : {
        type: String,
    },
    location : {
        latitude: {type:Number},
        longitude:{type:Number}
    },
    numberToCall:{
        type: String
    }
});

incidentSchema.plugin(uniqueValidator);
const incident = module.exports = mongoose.model('incident', incidentSchema);
