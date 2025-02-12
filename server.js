// check to see if in production mode, if not, we will load all of the .env variables. NODE_ENV will be set by default by node so will know if in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// reference to our index route
const indexRouter = require('./routes/index');

// configure express app
// set our view engine, we will use ejs
app.set('view engine', 'ejs');
// set where our views are going to come from,
// __dirname gets current directory and then we will append the location which will be the view folder
app.set('views', __dirname + '/views');
// hook up express layouts
// idea of layout file is every single file is going to be put inside this layout file so we don't have duplicate all of the begining HTML and ending HTML of our project like the header and footer
app.set('layout', 'layouts/layout');
// tell express we want to use Expres Layouts
app.use(expressLayouts);
// where our public files will be - JS, css, images. Public is just common usage for this but can be anything
app.use(express.static('public'));

const mongoose = require('mongoose');

// Connect to MongoDB using an environment variable for the database URL, first arguement is the URL and second are a list of options if you need them.
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to Mongoose'))
  .catch((error) => console.error(error));

// first root path, then what router we want to handle that route.
app.use('/', indexRouter);

// will pull from the environment variable when we deploy. The server will tell us what PORT it is listening to.
app.listen(process.env.PORT || '3000');
