var express = require('express');
var router = express.Router();
var md5 = require('md5');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect(process.env.MONGOLAB_URI);

/* GET home page. */
router.get('/', cors(), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
