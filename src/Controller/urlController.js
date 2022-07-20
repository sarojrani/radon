//----------------------Imports------------------------//
const urlModel = require("../Models/UrlModel");
const shortId = require("shortid");
const UrlModel = require("../Models/UrlModel");
const validator = require("validator");
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13190,
    "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//----------------createURL

const urlShorten = async function (req, res) {
    try {

        let data = req.body
        let { longUrl } = data
        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please provide url to search" })
        //--------------------URL Validation

        if (!validator.isURL(longUrl))
            return res.status(400).send({ status: false, message: "Not Valid Url" })

        //----------------------DB Call

        let urlFind = await urlModel.find({longUrl}).select({urlCode:0})

        console.log(urlFind)
        if (urlFind) return res.status(201).send({status:true,data:urlFind })
        const baseUrl = `https://localhost:3000`
        const urlCode = shortId.generate()
        const shortUrl = baseUrl + '/' + urlCode
        url = new UrlModel({
            longUrl,
            shortUrl,
            urlCode
        })
        let result = await urlModel.create(url)
        return res.status(201).send({ status: true, data: result })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
};

//-------------------------getAPI

const getUrl = async function (req, res) {
    try {
        let code = req.params.urlCode
        //---------------urlcode validation

        if (!shortId.isValid(code)) return res.status(400).send({ status: false, message: "Invalid Id" })
        // let result = await urlModel.findOne({ urlCode: req.params.urlCode },{urlCode:1,longUrl:1,shortUrl:1})
        // if (!result) return res.status(404).send({ status: false, message: "URL is not present in data base" })//

        let cahcedurlData = await GET_ASYNC(`${req.params.urlCode}`)
     
        if (cahcedurlData) { res.status(200).send({status:true,data:{urlCode:cahcedurlData.urlCode,longUrl:cahcedurlData.longUrl,shortUrl:cahcedurlData.shortUrl}})}
         else {
            let urlData = await urlModel.findOne({ urlCode: req.params.urlCode },{urlCode:1,longUrl:1,shortUrl:1});
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(urlData))
            res.status(200).send({status:true, data: urlData });
        }


        // let result = await urlModel.findOne({ urlCode: req.params.urlCode })
        // if (!result) return res.status(404).send({ status: false, message: "URL is not present in data base" })
        // if (result) return res.status(302).redirect(result.longUrl )
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
};

//--------------------------Exports
module.exports = { urlShorten, getUrl };