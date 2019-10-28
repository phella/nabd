const router = require("../index");
const {register} = require("./registerRoute");
const {login} = require("../loginUtilities");
const {logout} = require("../logoutUtilities");
const dbManger = require("../../services/dbManger");
router.post('/register/ambulance',async function (req, res) {
	req.body.rating = 100;
	return register(req,res);
});

router.post('/login/ambulance', async (req, res) => {
	return login(req,res,dbManger.findambulace);
});

router.delete('/logout/ambulance', async(req,res)=>{
	return logout(req,res);
})