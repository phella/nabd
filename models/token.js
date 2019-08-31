const mongoose = require("mongoose");

// token schema to be saved in db
const tokenSchema = mongoose.Schema({
    _id: {
        type : String,
        require : true
    },
    tokenCode : {
        type: String,
        require : true
    }
});

module.exports = mongoose.model('token', tokenSchema);
