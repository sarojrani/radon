//------------Imports---------------//
const express = require("express");
const router = express.Router();
const urlController = require ("../Controller/urlController");


//---------------Test-api
router.get("/test-api", function(req,res){
    res.send("This is my ist api")
})

//---------------API
router.post("/url/shorten",urlController.urlShorten);
router.get("/:urlCode",urlController.getUrl)

//if user will hit wrong url
router.all("/**",function(req,res){
    res.status(404).send({status:false,msg:"No such site exist"})
})

//---------------Export
module.exports=router