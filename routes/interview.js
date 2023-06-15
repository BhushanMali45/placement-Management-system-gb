
const express = require("express");
const {
  jobPost,
  addInterview,
  create,
  enrollInInterview,
  deallocate,
  destroy,
  apply,
  createapply
} = require("../controllers/interviewController");
const router = express.Router();
const auth = require("../middleware/Auth");

//multer for cv
const multer = require("multer");
const path = require("path");
router.use(express.static('public'))

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/resume'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});


router.get("/jobPost",auth.isLogin, jobPost);
// redering add interview page
router.get("/add-interview",auth.isLogin, addInterview);

// creating a new interview
router.post("/create", create);


router.get("/destroy/:interviewId",auth.isLogin, destroy);

// enrolling student in an interview
router.post("/enroll-in-interview/:id", enrollInInterview);

// deallocate the student from the interview
router.get("/deallocate/:studentId/:interviewId",auth.isLogin, deallocate);

router.get("/apply",auth.isLogin, apply);

router.post("/createapply",upload.single('resume'), createapply);


// exporting the router
module.exports = router;
