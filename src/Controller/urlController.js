const urlModel= require ("../Models/UrlModel");
const shortId = require ("shortid")

const urlShorten = async function (req,res){
    try{
        let data = req.body;
        url=data.longUrl
        const urlCode = shortid.generate()
        req['urlCode'] = urlCode;
        req['shortUrl'] = shortUrl;
    let savedData = await urlModel.create(data)
    return res.status(201).send({status:true, msg:savedData})




    } catch(err){
        res.status(500).send({status:false,error:err.message})
    }
}