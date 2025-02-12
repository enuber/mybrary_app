const express = require('express');
// gets router from express so we can create routes
const router = express.Router();

// root of our application
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
