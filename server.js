// check to see if in production mode, if not, we will load all of the .env variables. NODE_ENV will be set by default by node so will know if in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// reference to our index route
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

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
// hook up method-override, we use _method because it is unlikely to be a name in input on the form. It is going to be sent as if it was an input on the form. This will be where we put the PUT or DELETE in the form
app.use(methodOverride('_method'));
// where our public files will be - JS, css, images. Public is just common usage for this but can be anything
app.use(express.static('public'));
// setting to urlencoded because we are sending the values via URL to our server, we also set a limit, increasing the size of what can be sent to make it easier when we uploade files to the server.
app.use(express.urlencoded({ limit: '10mb', extended: false }));

const mongoose = require('mongoose');

// Connect to MongoDB using an environment variable for the database URL, first arguement is the URL and second are a list of options if you need them.
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to Mongoose'))
  .catch((error) => console.error(error));

// first root path, then what router we want to handle that route.
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// will pull from the environment variable when we deploy. The server will tell us what PORT it is listening to.
app.listen(process.env.PORT || '3000');
