const express = require('express');
// gets router from express so we can create routes
const router = express.Router();
const Author = require('../models/author');

// all authors route
router.get('/', async (req, res) => {
  // will set up searchOptions and then check if we have fields to search and add them in. If not, the {} will mean there is no condition and we would get all authors.
  let searchOptions = {};
  // do req.query instead of req.body because a GET request has a query string attached that will have the property.
  if (req.query.name != null && req.query.name != '') {
    // does a regexp on the name where the i flag is used to show it's case insensitive
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    // we are sending the request back so that it will repopulate the search field with the value that was searched
    res.render('authors/index', { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect('/');
  }
});

// new author route
router.get('/new', (req, res) => {
  // this doesn't save anything ot the DB. but it does create a new author which we can use to save and delete things inside the DB and it also gives us an object we can use in our ejs file.
  res.render('authors/new', { author: new Author() });
});

// create authors route
router.post('/', async (req, res) => {
  const author = new Author({ name: req.body.name });

  try {
    const newAuthor = await author.save();
    // res.redirect(`/authors/${newAuthor.id}`); // Redirect to author details page
    res.redirect(`authors`);
  } catch {
    // passing back the different parameters back to the author's page so if a name was already entered it will show back up.
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author',
    });
  }
});

module.exports = router;
