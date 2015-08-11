var express = require('express');
var router = express.Router();
var lookup = require('lolking-lookup');
var lolHeroes = require('../data/lol-champions.json');
var cors = require('cors');

router.get('/:loluser', cors(), function(req, res) {
  lookup('na', req.params.loluser, function(error, user) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }

    res.json(user);
    // res.json(userHeroes);
  });
});


router.get('/:loluser/heroes', cors(), function(req, res) {
  lookup('na', req.params.loluser, function(error, user) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }

    var userHeroesData = user.most_played_champions;
    var userHeroIds = [];
    var userHeroes = [];

    for (var i = 0; i < userHeroesData.length; i++) {
      userHeroIds.push(userHeroesData[i].champion_id);
    }

    for (var i = 0; i < lolHeroes.length; i++) {
      for (var j = 0; j < userHeroIds.length; j++) {
        if (lolHeroes[i].id == userHeroIds[j]) {
          userHeroes.push(lolHeroes[i]);
        }
      }
    }

    res.json(userHeroes);
  });
});


module.exports = router;
