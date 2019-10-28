const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const chalk = require("chalk");
require('dotenv').config();
require('./services/cache.service');


app.use(require("./middlewares/authentication"));

io.on('connection', (socket) => {
	socket.on('open chat', (data) => {
	   const messages = controller.getLastMessages(data.myID,data.secondID);
	   socket.emit('last messages',messages);
	}); 
	console.log('user connected');
  });

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


// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
if(!module.parent) {
	server.listen(port, () => {
		console.log(`Listening on ${chalk.green(port)}`);
	});
}


module.exports = io;