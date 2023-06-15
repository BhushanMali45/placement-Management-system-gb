
const express = require("express");











const {
  addStudent,
  update,
  editStudent,
  create,
  destroy,
  viewApplication,
  removeApplication


} = require("../controllers/studentController");
const router = express.Router();

router.use(express.static('public'))



//multer for cv
const multer = require("multer");
const path = require("path");
router.use(express.static('public'))

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/CVImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

const auth = require("../middleware/Auth");
// rending add  Student page
router.get("/add-student",auth.isLogin, addStudent);

// updating the student
router.post("/update/:id", update);

// rendering edit page
router.get("/edit-student/:id",auth.isLogin, editStudent);

// creating a new Student
router.post("/create",upload.single('image'),create);

// deleting a particular student
router.get("/destroy/:studentId",auth.isLogin, destroy);

router.get("/viewApplication",auth.isLogin, viewApplication);
router.get("/removeApplication",auth.isLogin, removeApplication);





module.exports = router;
