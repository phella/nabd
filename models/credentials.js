const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

// credentials Schema
const credentialsSchema = mongoose.Schema({
    phoneNo : {
        type: String,
        require : true,
        min: 11,
        max: 11
    },
    password : {
        type: String,
        require : true
    },
    isActivated: {
        type: Boolean,              
        require :true
    }
});

credentialsSchema.plugin(uniqueValidator);
const credentials = module.exports = mongoose.model('credentials', credentialsSchema);
