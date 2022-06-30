// ==+==+==+==+==+==+==+==+==+==[Imports]==+==+==+==+==+==+==+==+==+==
const internModel = require("../models/internModel")
const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");


// ==+==+==+==[Validation Functions]==+==+==+==+=

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string")
        return true;
};

const isValidBody = function (body) {
    return Object.keys(body).length > 0
}

// ==+==+==+==+===+==+==+==[ Create Intern ]==+==+==+==+===+==+==+==+=

const createIntern = async function (req, res) {
    try {
        let data = req.body
        let { name, email, mobile, collegeName } = data

        //---------[Required Fields]

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "please provide data to Create" })
        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!mobile) return res.status(400).send({ status: false, message: "mobile is required" })
        if (!collegeName) return res.status(400).send({ status: false, message: "CollegeName is required" })

        //----------[ Check College ]

        let checkClg = await collegeModel.findOne({ name: collegeName })
        if (!checkClg) return res.status(400).send({ status: false, message: "CollegeName not found" })
        let collegeId = checkClg._id

        //-------[ Name Validation]

        if (!(/^[A-Za-z_ ]+$/.test(name)))
            return res.status(400).send({ status: false, message: "Name is Invalid " })

        //-------[ Email Validation]

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is Invalid" })
        let Email = await internModel.findOne({ email })
        if (Email) return res.status(400).send({ status: false, message: email + " email is already used" })

        //------[Mobile Validation]

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))) return res.status(400).send({ status: false, message: mobile + " number is invalid" })
        let checkMobile = await internModel.findOne({ mobile: mobile })
        if (checkMobile) return res.status(400).send({ status: false, message: "Mobile is already registerd" })

        //------[response]

        let savedata = await internModel.create({ name, email, mobile, collegeId })
        res.status(201).send({ status: true, data: savedata })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createIntern = createIntern