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

/*io.on('connection',async function(socket){
	socket.phoneNo = socket.handshake.query.param;
	const type = await client.hget("ready" , phoneNo) ;
	if(type){
		client.hdel("ready",phoneNo);
		client.hset("available",phoneNo,type);
	}
	console.log('A new client connected' + socket.handshake.query.param);
});
*/

io.on('connection', (socket) => {
	socket.on('open chat', (data) => {
	   const messages = controller.getLastMessages(data.myID,data.secondID);
	   socket.emit('last messages',messages);
	}); 
	console.log('user connected');
  });

io.on('disconnect',function(){
	redis.hdel("available",io.socket.phoneNo);
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

// Client should subscribe on ambulance phoneNo
io.on("liveLocation",(info)=>{
	const longtiude = info.longtiude; 
	const attiude = info.attiude;
	io.emit(phoneNo,{longtiude , attiude});
});

server.listen(3000, () => {
	console.log(`started on port: ${3000}`);
  });

module.exports = {send};
