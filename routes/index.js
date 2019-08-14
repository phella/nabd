const express = require ("express");
const router = express.Router();

router.use(require("./permedicRoute"));

module.exports = router;