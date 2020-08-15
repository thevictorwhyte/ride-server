const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

const db = mongojs(
  'mongodb+srv://victor:victor999@ride-app.xqxjk.mongodb.net/ride?retryWrites=true&w=majority',
  ['bookings']
);

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

  if (!booking.userName) {
    res.status(400).json({ error: 'bad data' });
  } else {
    db.bookings.save(booking, (err, savedBooking) => {
      if (err) {
        res.send(err);
      }
      res.json(savedBooking);
    });
  }
});

module.exports = router;
