const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  checkUserexistence,
  createBlog,
} = require("../controllersforchatapp/usercontroller");
const { protect } = require("../middlewareforchatapp/authmiddleware");
const router = express.Router();

router.post("/createuserforchat", registerUser);
router.post("/login", authUser);
router.get("/", protect, allUsers);
router.post("/check", checkUserexistence);
router.post("/createblog", createBlog);

module.exports = router;
