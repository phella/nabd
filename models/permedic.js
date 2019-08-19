const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @constructor Permedic
 * @param {String} name permedic name
 * @param {String} bio permedic bio
 * @param {Number} rating permedic rating
 * @param {String} password permedic account password
 * @param {String} gender permedic gender
 * @param {String} number permedic phone number
 */
const permedicSchema = new Schema({
	name: String,
	bio: String,
	rating: Number,
	password: String,
	gender: String,
	number:String,
	profilePath: String
});

mongoose.model("permedic", permedicSchema);

