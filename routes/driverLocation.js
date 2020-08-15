const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

const db = mongojs(
  'mongodb+srv://victor:victor999@ride-app.xqxjk.mongodb.net/ride?retryWrites=true&w=majority',
  ['driversLocation']
);

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
module.exports = router;
