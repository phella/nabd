const router = require("../index");
const {register} = require("./registerRoute");
const {login} = require("../loginRoute");
const dbManger = require("../../services/dbManger");
router.post('/register/paramedic',async function (req, res) {
	req.body.rating = 100;
	return register(req,res);
});

router.post('/login/paramedic', async (req, res) => {
	return login(req,res,dbManger.findParamedic);
});