
var config = require('../models/config');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  // We pass our config to the jade partials.
  var vars = {
    config: config.load()
  };
  res.render('partials/' + name, vars);
};
