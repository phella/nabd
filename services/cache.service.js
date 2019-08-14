const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";

const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);


mongoose.Query.prototype.cache = function (options = {}) {
	this.useCache = true;
	this.hashKey = options.key || 'no key';
	return this;
}

/////////////////////////////////////////////////
// current saving ----> ID ------> collectionName
/////////////////////////////////////////////////

mongoose.Query.prototype.exec = async function () {
	
	// Query doesn't use cache
	if(this.useCache !== true) {
		const result = await exec.apply(this,arguments);
		return result;
	}
	const collectionName =  this.mongooseCollection.name;
	const cacheValue = await client.hget(this.hashKey,collectionName);
	// Query is cached
	if(cacheValue){
		const doc = JSON.parse(cacheValue);
		return Array.isArray(doc)
			? doc.map( d => new this.model(d))
			: new this.model(doc); 
	}

	// Get data from db and cache it
	const result = await exec.apply(this,arguments);
	client.hset(this.hashKey,collectionName,JSON.stringify(result));
	return result;
};

module.exports = {
	clearHash(hashKey){
		client.del(hashKey);
	}
};


