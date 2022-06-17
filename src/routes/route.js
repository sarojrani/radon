const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const commonMW= require("../middleWares/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser  )

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId",commonMW.authenticate, userController.getUserData)

router.put("/users/:userId",commonMW.authenticate, userController.updateUser)

router.delete("/users/:userId",commonMW.authenticate, userController.deleteInfo)

router.post("/user/:userId/posts", commonMW.authenticate, userController.postMessage)

module.exports = router;