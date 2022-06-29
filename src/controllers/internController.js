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

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

// ==+==+==+==+===+==+==+==[ Create Intern ]==+==+==+==+===+==+==+==+=

const createIntern = async function (req, res) {
    try {
        let data = req.body
        let { name, email, mobile, collegeId } = data

        //---------[Required Fields]
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "please provide data to Create" })
        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!mobile) return res.status(400).send({ status: false, message: "mobile is required" })

        //----------[Check Id is Present or Not in DB]
        if (collegeId) {
            if (!isValidObjectId(collegeId)) return res.status(400).send({ status: false, message: "Enter valid College Id" })
            let checkId = await collegeModel.findById(collegeId)
            if (!checkId) return res.status(400).send({ status: false, message: "College Id not found" })
        }

        //-------[ Name Validation]

        if (!(/[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)))
            return res.status(400).send({ status: false, message: "Name is Invalid " })

        //-------[ Email Validation]

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is Invalid" })
        let Email = await internModel.findOne({ email })
        if (Email) return res.status(400).send({ status: false, msg: email + " email is already used" })

        //------[Mobile Validation]

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))) return res.status(400).send({ status: false, msg: mobile + " number is invalid" })
        let checkMobile = await internModel.findOne({ mobile: mobile })
        if (checkMobile) return res.status(400).send({ status: false, message: "Mobile is already registerd" })

        //------[response]

        let savedata = await internModel.create(data)
        res.status(201).send({ status: true, data: savedata })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createIntern = createIntern