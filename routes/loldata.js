var express = require('express');
var router = express.Router();
var lookup = require('lolking-lookup');

router.get('/:loluser', function(req, res) {
  lookup('na', req.params.loluser, function(error, data) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }
    console.log(data);
    res.json(data);
  });
});


module.exports = router;
