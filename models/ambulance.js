const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @constructor ambulace
 * @param {String} name ambulace name
 * @param {String} bio ambulace bio
 * @param {Number} rating ambulace rating
 * @param {String} password ambulace account password
 * @param {String} gender ambulace gender
 * @param {String} number ambulace phone number
 */
const ambulaceSchema = new Schema({
	name: String,
	rating: Number,
	age:Number,
	password: String,
	gender: Boolean,
	_id:String,
	profilePath: String
});

module.exports = mongoose.model("ambulace", ambulaceSchema);

