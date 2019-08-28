const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();

// Connection URL
const url = process.env.URL;

// Database Name
const dbName = process.env.DBNAME_TEST;

// init Database in db
module.exports.initDatabase = function() {
  // Use connect method to connect to the server
  MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    // assert errors
    assert.equal(null, err);
    console.log("...");
    const db = client.db(dbName);

    // Insert empty documents
    var collection = db.collection('accounts');
    collection.insertMany([{}]);
    collection = db.collection('codes');
    collection.insertMany([{}]);
    collection = db.collection('credentials');
    collection.insertMany([{}]);
    collection = db.collection('patients');
    collection.insertMany([{}]);
    collection = db.collection('permedics');
    collection.insertMany([{}]);

    console.log("Database intialized successfully!");
    // close client
    client.close();
  });
}

module.exports.cleanDatabase = function() {
  MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    // assert errors
    assert.equal(null, err);
    console.log("...");
    const db = client.db(dbName);

    //drop database
    db.dropDatabase();
    console.log("Database deleted successfully!");
    // close client
    client.close();
  });

}