const express = require('express');
// gets router from express so we can create routes
const router = express.Router();
const Book = require('../models/book');

// root of our application
router.get('/', async (req, res) => {
  let books = [];
  try {
    // will find all the books, then sort them in descending order by createdAt date. then limit them to just the latest 10 books. Then need to execute the code so need to chain on .exec()
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch {
    books = [];
  }
  res.render('index', { books: books });
});

module.exports = router;
