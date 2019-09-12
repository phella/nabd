const express = require ("express");
const router = express.Router();
module.exports = router;
require("./paramedicRoute");
require("./Register/patientRoute");
require("./Register/paramedicRoute");
require("./Register/registerRoute");
require("./loginRoute");
require("./logoutRoute");