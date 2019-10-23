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


function get_file(filename)
{
  let out ;
    fs.readdir(path.dirname(__filename)+"\\..\\media\\", async function (err, files) {
        if (err) {
          console.log(err);
          return;
        }
       out = await files.filter(function(element){ return element == filename; })[0]
      });
      return out
}


router.post('/media',upload.single("file"),function (req, res) {
    res.status(200).send({"id":req.file.filename});
});

router.get('/media',async function(req,res){
  const filename = req.body.id;

  //const out = get_file(id)
  //console.log(out)
  res.sendFile(path.resolve(path.dirname(__filename)+"\\..\\media\\"+id)) 
  // if(out.length==0)
  //   res.status(404).send({"Error":"file is not found"});
  // else
  // {
  //   console.log(out)
  //   res.sendFile("../media/"+id)
  //   //res.status(200).send("sucess");
  // }
    
})
