const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require("body-parser");
const route = require ("./routes/route");
const shortId = require (" shortid");
const validUrl = require (" valid-url")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://sandeep3232:HbRR4Rf0Je1OJJ3g@clusterlast.mbsld8m.mongodb.net/group6DataBase', { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected'))
    .catch((err) => console.log(err.message))

app.use("/", route);

app.all('/**', (req, res) => {
    res.status(404).send({ status: false, message: "Either Page Not Found! or You are missing some of the ParaMeters" })
 })
 
app.listen(process.env.PORT || 3000, () => {
    console.log("Express app running on port" + (process.env.PORT || 3000))
}
)

