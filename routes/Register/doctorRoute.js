const router = require("../index");
const {register} = require("./registerRoute");
const {login} = require("../loginUtilities");
const {logout} = require("../logoutUtilities");
const dbManger = require("../../services/dbManger");

router.post('/register/doctor',async function (req, res) {
	req.body.rating = 100;
	return register(req,res);
});

router.post('/login/doctor', async (req, res) => {
	return login(req,res,dbManger.findDoctor);
});

router.delete('/logout/doctor', async(req,res)=>{
	return logout(req,res);
})