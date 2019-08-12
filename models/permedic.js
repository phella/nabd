const mongoose = require("mongoose");
const { Schema } = mongoose;

const permedicSchema = new Schema({
	name: String,
	bio: String,
	rating: Number,
	password: String,
	gender: String,
	number:String
});

mongoose.model("permedic", permedicSchema);