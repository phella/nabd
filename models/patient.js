const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new Schema({
	name: String,
	age:Number,
	password: String,
	gender: Boolean,
	phoneNo:String,
	profilePath: String
});

mongoose.model("patient", patientSchema);

