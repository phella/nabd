const util = require('util');
const redis  = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on("available", async (obj)=>{
            console.log(obj);
            socket.phoneNumber = obj.phoneNumber;
            socket.userType = obj.userType;
            let result =  await client.hget("online",obj.userType);
            let clients;
            if(result){
                clients.push(phoneNumber);
            }else {
                clients = [];
            }
            clients.push(phoneNumber);
            client.hset("online",obj.userType,JSON.stringify(clients));
        });
        socket.on('message', function(message) {
            logger.log('info',message.value);
            socket.emit('ditConsumer',message.value);
            console.log('from console',message.value);
        });
        socket.on('disconnect', function() {
            console.log('Got disconnect!');
            let results = client.hget("online",socket.userType);
            if(results){
                let clients = JSON.parse(results);
                var filtered = clients.filter(function(value, index, arr){
                    return (value != socket.phoneNumber);
                });
                                
                client.hset(socket.phoneNumber,socket.userType,filtered);
            }
        });
		console.log("user connected");
    });
};