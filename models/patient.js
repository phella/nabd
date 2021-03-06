const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new Schema({
	_id:String, // phone number
	name: String,
	birthDate:Date,
	password: String,
	gender: Boolean,
	profilePath: String
},{
	versionKey:false
});

module.exports =  mongoose.model("patient", patientSchema);

