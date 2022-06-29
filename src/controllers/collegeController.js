const collegeModel = require("../models/collegeModel")
const validUrl = require('valid-url');

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
   if(validUrl.isUri(value)) return true
}

// ==+==+==+====+==+==+==+=[ Create College ]==+==+==+==+===+==+==+==+=

const createCollege = async (req, res) => {
    try {
        let data = req.body 
        if(!isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide data to Create" })

        let { name, fullName, logoLink } = data

        if (!name) return res.status(400).send({ status: false, msg: "Name Is required" });
        if (!isValid(name)) return res.status(400).send({ status: false, Error: "Name is Invalid" })

        if (!fullName) return res.status(400).send({ status: false, msg: "Full Name Is required" });
        if (!isValid(fullName)) return res.status(400).send({ status: false, Error: "Full Name is Invalid" })

        if (!logoLink) return res.status(400).send({ status: false, msg: "Logo Link Is required" });
        if (!isValidUrl(logoLink))
         return res.status(400).send({ status: false, Error: "Logo Link is Invalid" })

        let savedData = await collegeModel.create(data)

        res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createCollege = createCollege