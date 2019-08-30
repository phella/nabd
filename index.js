const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // socket.io instance initialization

const chalk = require("chalk");
require('dotenv').config();
require('./services/cache.service');


app.use(require("./middlewares/authentication"));

if (process.env.NODE_ENV==='test'){
	Mongoose.connect(process.env.DATABASECONNECTION_TEST,{useNewUrlParser:true},
		console.log("Connected to database for unit testing!")
	);
}
else{
	Mongoose.connect(process.env.DATABASECONNECTION_DEV,{useNewUrlParser:true},
		console.log("Connected to database for Dev!")
	);
}
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','*');
	if(req.method ==='POPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT','POST','GET','DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api",require("./routes/"));


io.on('connection', function(socket){
	console.log('A new client connected');
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
if(!module.parent) {
	app.listen(port, () => {
		console.log(`Listening on ${chalk.green(port)}`);
	});
}

module.exports = app;