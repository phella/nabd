const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

// Account Schema
const accountSchema = mongoose.Schema({
    name : {
        type: String,
        require : true,
        min : 2,
        max : 28
    },
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
    age: {
        type: Number,
        require : true,
        min : 1,
        max : 120
    },
    gender: {
        type: Boolean,              // male : true          female : false
        require :true
    }
});

accountSchema.plugin(uniqueValidator);
const account = module.exports = mongoose.model('account',accountSchema);
