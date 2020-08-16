const express = require('express');
const path = require('path');

const index = require('./routes/index');
const bookings = require('./routes/bookings');
const driverLocationSocket = require('./routes/driverLocation');
const driverLocation = require('./routes/driverLocation');
const drivers = require("./routes/drivers");

const app = express();

const port = 3000;

const socketio = require('socket.io');

const io = socketio();

//views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// body parsing functionality
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.use('/', index);
app.use('/api', bookings);
app.use('/api', driverLocationSocket);
app.use('/api', driverLocation);
app.use("/api", drivers);

io.listen(
  app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${process.env.PORT || port}`);
  })
);

app.io = io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);
})
