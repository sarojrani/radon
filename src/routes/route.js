const express = require("express");
const router = express.Router();
const urlController = require ("../Controller/urlController");
const shortId = require ("shortid")

router.get("/test-api", function(req,res){
    res.send("This is my ist api")
})

router.post("/url/shorten",urlController.urlShorten)




module.exports=router