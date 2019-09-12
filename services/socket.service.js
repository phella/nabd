
const express = require('express');
const app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const util = require('util');
const redis  = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

io.on('connection', function(socket){
	console.log('A new client connected' + socket.handshake.query.param);
});

function send(channels,message){
	channels.forEach(element => {
		io.emit(element);
	});
	io.on(message,answer);
}

function answer(res){
	const paramedics = JSON.parse( client.hget("online","paramedic"));
	if(res.type==1){
	paramedics.push(res.id);
	} else {
		for( var i = 0; i < paramedics.length; i++){ 
			if ( paramedics[i] === res.id) {
			  paramedics.splice(i, 1); 
			}
		 }
	}
	client.hset("online","paramedic",JSON.stringify(paramedics));
}

module.exports = {send};