const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // removing required as we can have a book without a description
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    // give it a default of todays date so it doesn't have to be manully set
    default: Date.now,
  },
  // we will make this a string so we have the name of the image but, store the image on the server. This makes the files smaller.
  coverImageName: {
    type: String,
    required: true,
  },
  author: {
    // tells mongoose that we are referncing another object inside of our collections
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // this is the ref the type needs, it is referencing the Author collection we created earlier and the name must match the name we used in the mongoose.model(thisnamehere, schematype)
    ref: 'Author',
  },
});

// will allow us to create a virtual propety that acts the same as any of the variables in the schema. It will derive it's value from these variables. Using a regular function becuase we need access to the this property which is linked to the book itself.
bookSchema.virtual('coverImagePath').get(function () {
  if (this.coverImageName != null) {
    // we are using the path from node.js, and joining mulitple segments coverImageBasePath is our uploads/bookCovers and this.coverImageName is the name created for the cover. This will give us out the full path to our book which we will use inside the view index.ejs file for the src of the images of book covers.
    return path.join('/', coverImageBasePath, this.coverImageName);
  }
});

// give name to model which is "Book", this will be the name of our table in the database. then pass in the schema
module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
