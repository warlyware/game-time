var express = require('express');
var router = express.Router();
var lookup = require('lolking-lookup');
var lolHeroes = require('../data/lol-champions.json');

router.get('/:loluser', function(req, res) {
  lookup('na', req.params.loluser, function(error, user) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }

    res.json(user);
    // res.json(userHeroes);
  });
});


router.get('/:loluser/heroes', function(req, res) {
  lookup('na', req.params.loluser, function(error, user) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }

    console.log(user.most_played_champions);
    var userHeroesData = user.most_played_champions;
    var userHeroIds = [];
    var userHeroes = [];

    for (var i = 0; i < userHeroesData.length; i++) {
      userHeroIds.push(userHeroesData[i].champion_id);
      console.log('userHeroIds', userHeroIds);
    }

    for (var i = 0; i < lolHeroes.length; i++) {
      for (var j = 0; j < userHeroIds.length; j++) {
        if (lolHeroes[i].id == userHeroIds[j]) {
          userHeroes.push(lolHeroes[i]);
          console.log('```User Heroes```' + userHeroes);
        }
      }
    }

    res.json(userHeroes);
  });
});


module.exports = router;
