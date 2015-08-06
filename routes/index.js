var express = require('express');
var router = express.Router();
var md5 = require('md5');
var mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_6mm8k2vr:j2llrlvlvu6pfr7os0m804pdj8@ds041188.mongolab.com:41188/heroku_6mm8k2vr');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
