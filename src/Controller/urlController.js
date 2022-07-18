const urlModel = require("../Models/UrlModel");
const shortId = require("shortid");
//const config = require('config');
const UrlModel = require("../Models/UrlModel");
const { stack } = require("../routes/route");

const urlShorten = async function (req, res) {
    try {
        let { longUrl } = req.body;
        if (!/^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s])?$/.test(longUrl))
            return res.status(400).send({ status: false, msg: "Not Valid Url" })
        if (!longUrl) return res.status(400).send({ status: false, msg: "Please provide url to search" })
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
    }
};

const getUrl = async function (req, res) {
    try {
        let result = await urlModel.findOne({ urlCode: req.params.urlCode })
        if (!result) return res.status(404).send({ status: false, msg: "URL is not present in data base" })
        if (result) return res.status(200).send({ status: true, msg: result.longUrl })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
};

module.exports = {
    urlShorten, getUrl
}