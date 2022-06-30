const collegeModel = require("../models/collegeModel")
const validUrl = require('valid-url');
const internModel = require("../models/internModel");


// ==+==+==+==[Validation Functions]==+==+==+==+=

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

        //-------[ Name Validation]

        if (!name) return res.status(400).send({ status: false, message: "Name Is required" });
        if (!(/^[A-Za-z]+$/.test(name)))
            return res.status(400).send({ status: false, message: "Name is Invalid" })

        //-------[ Name Validation]

        let checkId = await collegeModel.findOne({ name: name })
        if (checkId) return res.status(400).send({ status: false, message: "College name is already present" })

        //-------[ FullName Validation]

        if (!fullName) return res.status(400).send({ status: false, message: "Full Name Is required" });
        if (!(/^[A-Za-z_ (,)]+$/.test(fullName)))
            return res.status(400).send({ status: false, message: "Full Name is Invalid" })

        //-------[ Link Validation]

        if (!logoLink) return res.status(400).send({ status: false, message: "Logo Link Is required" });
        if (!isValidUrl(logoLink))
            return res.status(400).send({ status: false, message: "Logo Link is Invalid" })

        //-------[ Create ]

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

        if (!filters) return res.status(400).send({ status: false, message: "please provide query to search" })

        let data = await collegeModel.findOne({ name: filters })

        if (!data) return res.status(404).send({ status: false, message: "College not found!" });

        let intern = await internModel.find({ collegeId: data._id.toString() }).select({ name: 1, email: 1, mobile: 1 })


        let { name, fullName, logoLink } = data

        let list = { name, fullName, logoLink, intern }

        if (intern.length === 0) {
            intern[0] = "No Intern for this college"
            return res.status(404).send({ status: false, data: list });
        }

        res.status(200).send({ status: true, data: list });

    }
    catch (err) {
        res.status(500).send({ status: false, message: err })
    }
}

module.exports.createCollege = createCollege
module.exports.collegeDetails = collegeDetails          
