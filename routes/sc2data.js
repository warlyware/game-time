var express = require('express');
var router = express.Router();
var bnet = require('battlenet-api')();

router.get('/:sc2id/:sc2', cors(), function(req, res) {
  var sc2id = req.params.sc2id;
  var sc2name = req.params.sc2;
  bnet.sc2.profile.profile({
    origin: 'us',
    id: sc2id,
    region: 1,
    name: sc2name
  }, {
    apikey: '546vvy2c49eswk8tndj4fjsp7yswzxvs'
  }, function(err, resp) {
    console.log(resp);
    res.json(resp);
  });
});

module.exports = router;
