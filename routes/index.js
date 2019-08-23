const express = require ("express");
const router = express.Router();

require("./permedicRoute");
require("./registerRoute");
require("./loginRoute");
module.exports = router;