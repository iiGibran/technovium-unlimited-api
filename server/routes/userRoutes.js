const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/api/user/:id", userController.getUser);

router.post("/api/user/signup", userController.createUser);

router.post("/api/user/password-reset", userController.passwordReset);

router.get("/api/user/password-reset", (req, res) => {
    res.send("password reset link have been sent to your email");
})

module.exports = router;
