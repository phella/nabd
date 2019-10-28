const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @constructor paramedic
 * @param {String} name paramedic name
 * @param {String} bio paramedic bio
 * @param {Number} rating paramedic rating
 * @param {String} password paramedic account password
 * @param {String} gender paramedic gender
 * @param {String} number paramedic phone number
 */
const paramedicSchema = new Schema({
	name: String,
	rating: Number,
	age:Number,
	password: String,
	gender: Boolean,
	_id:String,
	profilePath: String
});

module.exports = mongoose.model("paramedic", paramedicSchema);

