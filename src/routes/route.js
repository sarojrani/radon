const express = require('express');
const externalModule=require('../logger/logger')
const module1=require('../util/helper')
const module2=require('../validater/formatter')

const router = express.Router();

router.get('/test-me', function (req, res) {
    externalModule.welcome()
    module1.date()
    module2.a()
    module2.lowerc()
    module2.upperc()

    res.send('My first ever api!')

});

module.exports = router;
// adding this comment for no reason