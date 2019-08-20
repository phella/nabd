const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const chalk = require("chalk");
require('dotenv').config();
require('./services/cache.service');


app.use(require("./middlewares/authentication"));



Mongoose.connect(process.env.DATABASECONNECTION,{useNewUrlParser:true},
	console.log("Connected to database")
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api",require("./routes/"));


// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
if(!module.parent) {
	app.listen(port, () => {
		console.log(`Listening on ${chalk.green(port)}`);
	});
}

module.exports = app;