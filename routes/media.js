var path = require('path');
const router = require("./index");
fs = require('fs');

var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/')
  },
  filename: function (req, filename, cb) {
    file = String(Date.now())
    file += filename.originalname.substr(filename.originalname.lastIndexOf('.'))
    cb(null, file) 
  }
})

var upload = multer({ storage: storage })


router.post('/media',upload.single("file"),function (req, res) {
    res.status(200).send({"id":req.file.filename});
});

router.get('/media', function(req,res){
  const id = req.body.id;

  res.sendFile(path.resolve(path.dirname(__filename)+"\\..\\media\\"+id),function(err){
    if(err)
    {
      res.status(404).send({"Error":"File Not Found"});
    }
  }) 
})
