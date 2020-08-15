const express = require('express');
const path = require('path');

const index = require('./routes/index');
const bookings = require('./routes/bookings');

const app = express();

const port = 3000;

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

//views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// body parsing functionality
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.use('/', index);
app.use('/api', bookings);
