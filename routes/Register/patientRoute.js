const router = require("../index");
const {register} = require("./registerRoute");
const {login} = require("../loginRoute");
const {logout} = require("../logoutRoute");
const dbManger = require("../../services/dbManger");
router.post('/register/user',async function (req, res) {
	return register(req,res);
});

router.post('/login/user', async (req, res) => {
	return login(req,res,dbManger.findPatient);
});

router.delete('/logout/user', async(req,res)=>{
	return logout(req,res);
})