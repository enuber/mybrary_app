const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// give name to model which is "Author", this will be the name of our table in the database. then pass in the schema
module.exports = mongoose.model('Author', authorSchema);
