const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

const db = mongojs(process.env.DB_CONNECTION_STRING, ['bookings']);

router.get('/bookings', (req, res, next) => {
  db.bookings.find((err, bookings) => {
    if (err) {
      res.send(err);
    } else {
      res.json(bookings);
    }
  });
});

router.post('/bookings', (req, res) => {
  const booking = req.body.data;
  const nearByDriver = req.body.nearByDriver;
  const io = req.app.io;

  if (!booking.userName) {
    res.status(400).json({ error: 'bad data' });
  } else {
    db.bookings.save(booking, (err, savedBooking) => {
      if (err) {
        res.send(err);
      }
      res.json(savedBooking);
      if (nearByDriver.socketId) {
        io.emit(nearByDriver.socketId + "driverRequest", savedBooking)
      } else {
        console.log("Driver not connected");
      }
    });
  }
});

module.exports = router;
