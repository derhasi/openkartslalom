/*
 * Serve JSON to our AngularJS client
 */

var persons = require('../data/persons.json');

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.persons = function (req, res) {
  res.json(persons);
}
