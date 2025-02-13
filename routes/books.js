// Started with Authors so a bit mnore explanation in there.
const express = require('express');
// gets router from express so we can create routes
const router = express.Router();
// path is apart of node.js and, will allow us to create a path.
// const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
// use path.join to join two paths.
// const uploadPath = path.join('public', Book.coverImageBasePath);
const Author = require('../models/author');
// const multer = require('multer');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// all Book route
router.get('/', async (req, res) => {
  // don't do anything, this returns a query object which we can build a query from then execute later.
  let query = Book.find();
  if (req.query.title !== null && req.query.title != '') {
    // checking on the title of the book where 'title' is our database model parameter, then create a new regexp. Rest is similar to the author where we create a reg expression and don't care about the casing
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore !== null && req.query.publishedBefore != '') {
    // lte = less than or equal to.
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter !== null && req.query.publishedAfter != '') {
    // gte = greater than or equal to.
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    // const books = await Book.find({});
    // when query.exec() happens it will chain all of them, so it will apply all conditions met
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect('/');
  }
});

// new  Book route
router.get('/new', async (req, res) => {
  // here we aren't passing an error as we will never have an error in this case.
  renderNewPage(res, new Book());
});

// create authors route
// router.post('/', upload.single('cover'), async (req, res) => {

// also refactoring above to this after removing the enctype as we are getting a string.
router.post('/', async (req, res) => {
  // getting the file name if it exists, this is what happens behind scenes using Multer
  // const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    // will be a string so need to make it a "Date"
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    // if fileName is null we could use that to send an error saying they didn't upload a file
    // coverImageName: fileName,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect('books');
  } catch (error) {
    // removing because we are changing how we are storing the book cover.
    // if (book.coverImageName != null) {
    //   removeBookCover(book.coverImageName);
    // }
    // passing in the error as true since we had an error
    console.error('error saving book', error);
    renderNewPage(res, book, true);
  }
});

// need to pass in the response and the book as sometimes will be rendering a new book from the .get(/new) method and sometimes an existing book like from .post() where we will also be calling it because it errored out. Finally passing in an errorMessage as sometimes will have an error that we will default to false
async function renderNewPage(res, book, hasError = false) {
  try {
    // need to get all the authors since they will be listed in a select menu
    const authors = await Author.find({});
    // if we have an error we want to render an error message.So we remove the params from the res.render so we can check if there is an error and pass it in if there is.
    const params = { authors: authors, book: book };
    if (hasError) params.errorMessage = 'Error creating book';
    // creating a new book so that when a user modifies it, and we send back data saying that they incorrectly entered data we can populate the fields they already created.
    // const book = new Book();
    // we are sending the new books page all the authors and the books so the can be used their.
    res.render('books/new', params);
  } catch {
    res.redirect('/books');
  }
}

// No longer doing this because we aren't saving the books on the server rather pushing the strings to the DB.
function removeBookCover(fileName) {
  // using the path we created earlier, and combining it with the file name and, telling it to unlink it so it no longer shows up.
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.err(err);
  });
}

function saveCover(book, coverEncoded) {
  if (!coverEncoded) return;

  try {
    const cover = JSON.parse(coverEncoded);
    if (cover && imageMimeTypes.includes(cover.type)) {
      book.coverImage = Buffer.from(cover.data, 'base64');
      book.coverImageType = cover.type;
    }
  } catch (error) {
    console.error('Error processing cover image:', error);
  }
}

module.exports = router;
