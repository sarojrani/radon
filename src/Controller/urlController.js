const urlModel= require ("../Models/UrlModel");
const shortId = require("shortid");
//const config = require('config');
const UrlModel = require("../Models/UrlModel");

const urlShorten = async function (req,res){
    try{
        let {longUrl} = req.body;
        if(!longUrl) return res.status(400).send({status:false,msg:"Please provide valid url"})
        const baseUrl=`https://localhost:3000`
        const urlCode = shortId.generate()
        const shortUrl = baseUrl + '/' + urlCode
        url = new UrlModel({
            longUrl,
            shortUrl,
            urlCode
        })
        let result = await urlModel.create(url)
        return res.status(201).send({status:true,msg:url})




    } catch(err){
        res.status(500).send({status:false,error:err.message})
    }
};

module.exports={
    urlShorten
}