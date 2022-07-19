//----------------------Imports------------------------//
const urlModel = require("../Models/UrlModel");
const shortId = require("shortid");
const UrlModel = require("../Models/UrlModel");
const validator = require("validator");

//----------------createURL

const urlShorten = async function (req, res) {
    try {
        
        let data=req.body
        let { longUrl } = data
        if(!Object.keys(data).length) return res.status(400).send({ status: false, msg: "Please provide url to search" })
//--------------------URL Validation

        if (!validator.isURL(longUrl)) 
        return res.status(400).send({status:false,msg:"Not Valid Url"})
      
//----------------------DB Call

        let urlFind = await urlModel.findOne({ longUrl })
        console.log(urlFind)
        if (urlFind) return res.send({ short_url: `${urlFind.shortUrl}` })
        const baseUrl = `https://localhost:3000`
        const urlCode = shortId.generate()
        const shortUrl = baseUrl + '/' + urlCode
        url = new UrlModel({
            longUrl,
            shortUrl,
            urlCode
        })
        let result = await urlModel.create(url)
        return res.status(201).send({ status: true, msg: result })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }};

//-------------------------getAPI

const getUrl = async function (req, res) {
    try {
        let code=req.params.urlCode
//---------------urlcode validation

       if(!shortId.isValid(code)) return res.status(400).send({status:false,msg:"Invalid Id"})
        let result = await urlModel.findOne({ urlCode: req.params.urlCode })
        if (!result) return res.status(404).send({ status: false, msg: "URL is not present in data base" })
        if (result) return res.status(302).redirect(result.longUrl )
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }};

//--------------------------Exports
module.exports = { urlShorten, getUrl };