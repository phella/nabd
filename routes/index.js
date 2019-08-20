const express = require ("express");
const router = express.Router();

router.use(require("./permedicRoute"));
router.use(require("./accountRoute"));
module.exports = router;