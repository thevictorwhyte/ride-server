var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs(process.env.DB_CONNECTION_STRING, ["drivers"]);


//Get Single Driver
router.get("/driver/:id", function (req, res, next) {
    db.drivers.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, driver) {
        if (err) {
            res.send(err);
        }
        res.send(driver);
    });
});

module.exports = router;