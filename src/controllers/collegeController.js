const collegeModel = require("../models/collegeModel")
const validUrl = require('valid-url');
const internModel = require("../models/internModel");


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
const isValidUrl = function (value) {
    if (validUrl.isUri(value)) return true
}

// ==+==+==+====+==+==+==+=[ Create College ]==+==+==+==+===+==+==+==+=

const createCollege = async (req, res) => {
    try {
        let data = req.body
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "please provide data to Create" })

        let { name, fullName, logoLink } = data

        if (!name) return res.status(400).send({ status: false, message: "Name Is required" });
        if (!isValid(name)) return res.status(400).send({ status: false, Error: "Name is Invalid" })
        let checkId = await collegeModel.findOne({name: name})
        if (checkId) return res.status(400).send({ status: false, message: "College name is already present" })

        if (!fullName) return res.status(400).send({ status: false, message: "Full Name Is required" });
        if (!isValid(fullName)) return res.status(400).send({ status: false, Error: "Full Name is Invalid" })

        if (!logoLink) return res.status(400).send({ status: false, message: "Logo Link Is required" });
        if (!isValidUrl(logoLink))
            return res.status(400).send({ status: false, message: "Logo Link is Invalid" })

        let savedData = await collegeModel.create(data)

        res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ==+==+==+====+==+==+==+=[ Get College With Intern List ]==+==+==+==+===+==+==+==+=

const collegeDetails = async function (req, res) {
    try {

        let filters = req.query.name;

        if(!filters) return res.status(400).send({status: false, message: "please provide query to search"})
        
        let data = await collegeModel.findOne({name : filters})
        
        if (!data) return res.status(404).send({ status: false, message: "College not found! " });

        let intern = await internModel.find({collegeId:data._id.toString()}).select({name : 1, email: 1, mobile : 1})

        let {name, fullName, logoLink} = data

       let list = {name, fullName, logoLink, intern}

        res.status(200).send({ status: true, data: list });

    }
    catch (err) {
        res.status(500).send({ message: err })
    }
}

module.exports.createCollege = createCollege
module.exports.collegeDetails = collegeDetails