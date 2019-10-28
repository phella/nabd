const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @constructor doctor
 * @param {String} name doctor name
 * @param {String} bio doctor bio
 * @param {Number} rating doctor rating
 * @param {String} password doctor account password
 * @param {String} gender doctor gender
 * @param {String} number doctor phone number
 */
const doctorSchema = new Schema({
	name: String,
	rating: Number,
	age:Number,
	password: String,
	gender: Boolean,
	_id:String,
	profilePath: String,
	specialization:Number
});

module.exports = mongoose.model("doctor", doctorSchema);

