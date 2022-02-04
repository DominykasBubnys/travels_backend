const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload")

router.get("/users", UserController.GetUsers);

router.post("/users/sign-up", UserController.POST_signUp);

router.get("/user/:uid", UserController.GetUserById);

router.post("/users/login", UserController.Login)

module.exports = router;