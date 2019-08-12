const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

// code Schema
const codeSchema = mongoose.Schema({
    code : {
        type: String,
        require : true,
        min: 8,
        max: 8
    },
    phoneNo : {
        type: String,
        require : true,
        min: 11,
        max: 11
    },
    expirationDate : {
        type: Date,
        require : true
    }
});

codeSchema.plugin(uniqueValidator);
const code = module.exports = mongoose.model('code', codeSchema);
