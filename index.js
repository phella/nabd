const Mongoose = require("mongoose");
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const chalk = require('chalk');
 
Mongoose.connect("mongodb://localhost:27017/nabd",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${chalk.green(port)}`);
});