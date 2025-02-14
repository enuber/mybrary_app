const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// pre - before something occurs. will use normal function again so we can use "this"
authorSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    try {
      const authorId = this.getQuery()._id; // Correctly get the author ID
      const books = await Book.find({ author: authorId });

      if (books.length > 0) {
        return next(new Error('This author has books still'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }
);

// give name to model which is "Author", this will be the name of our table in the database. then pass in the schema
module.exports = mongoose.model('Author', authorSchema);
