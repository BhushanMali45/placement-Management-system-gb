
const { dashboard } = require("../controllers/dashBoardController");
const { downloadCSVReport } = require("../controllers/reportController");
const express = require("express");

// requiring files
const {
  profile,
  updatePW,
  signIn,
  createSession,
  addUser,
  create,
  destroySession,
  loadHome,
  companyUserlist,
  studentUserlist,
  removecompanyUser,
  removestudentUser,
} = require("../controllers/userController");
const router = express.Router();

const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));

const auth = require("../middleware/Auth");
// router for checking up the profile
router.get("/profile",auth.isLogin, profile);
router.post("/update", updatePW);


// route for dashboard
router.get("/dashboard",auth.isLogin,dashboard);

// router for home page
router.get("/",auth.isLogout,loadHome);

// router for sign in page
router.get("/sign-in",auth.isLogout, signIn);

router.post("/sign-in", createSession);

// route for sign up page
router.get("/addUser",auth.isLogin, addUser);
// router.get("/addUser", addUser);


// route for creating a new User
router.post("/create", create);

// route for logout button
router.get("/companyUserlist",auth.isLogin, companyUserlist);

router.get("/studentUserlist",auth.isLogin, studentUserlist);

router.get("/sign-out",auth.isLogin, destroySession);
router.get("/removestudentUser",auth.isLogin, removestudentUser);
router.get("/removecompanyUser",auth.isLogin, removecompanyUser);
// route for downloading csv reports
router.get("/download",auth.isLogin, downloadCSVReport);

module.exports = router;
