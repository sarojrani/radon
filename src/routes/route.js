const express = require("express");
const router = express.Router();

router.get("/test-api", function(req,res){
    res.send("This is my ist api")
})





module.exports=router