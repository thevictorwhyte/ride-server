const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

const db = mongojs(process.env.DB_CONNECTION_STRING, ['driversLocation']);

// update driver socket id
router.put('/driverLocationSocket/:id', (req, res, next) => {
  const io = req.app.io;
  if (!req.body) {
    res.status(400).json({ error: 'Bad data' });
  } else {
    db.driversLocation.update(
      { _id: mongojs.ObjectId(req.params.id) },
      { $set: { socketId: req.body.socketId } },
      (err, updatedDetails) => {
        if (err) {
          res.send(err);
        } else {
          res.send(updatedDetails);
        }
      }
    );
  }
});

//get nearby driver
router.get('/driverLocation', (req, res, next) => {
  db.driversLocation.ensureIndex({ "coordinate": "2dsphere" });
  db.driversLocation.find(
    {
      "coordinate": {
        "$near": {
          "$geometry": {
            "type": "Point",
            "coordinates": [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
          },
          "$maxDistance": 100000
        }
      }
    },
    (err, location) => {
      if (err) {
        res.send(err);
      } else {
        res.send(location);
      }
    }
  );
});

//Get Single Driver and emit track by user to driver
router.get("/driverLocation/:id", function (req, res, next) {
  var io = req.app.io;
  db.driversLocation.findOne({ driverId: req.params.id }, function (err, location) {
    if (err) {
      res.send(err);
    }
    res.send(location);
    io.emit("trackDriver", location);
  });
});

//Update Location by driver to user
router.put("/driverLocation/:id", function (req, res, next) {
  var io = req.app.io;
  var location = req.body;
  var latitude = parseFloat(location.latitude);
  var longitude = parseFloat(location.longitude);
  if (!location) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    db.driversLocation.update({ _id: mongojs.ObjectId(req.params.id) }, {
      $set: {
        socketId: location.socketId,
        coordinate: {
          "type": "Point",
          coordinates: [
            longitude,
            latitude
          ]
        }
      }
    }, function (err, updateDetails) {
      if (err) {
        console.log(updateDetails);
        res.send(err);
      }
      if (updateDetails) {

        //Get updated location
        db.driversLocation.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (error, updatedLocation) {
          if (error) {
            res.send(error);
          }
          res.send(updatedLocation);
          io.emit("action", {
            type: "UPDATE_DRIVER_LOCATION",
            payload: updatedLocation
          });
        });
      }
    });
  }
});

module.exports = router;
