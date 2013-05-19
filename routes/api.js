/*
 * Serve JSON to our AngularJS client
 */

var persons = require('../data/persons.json');

var fs = require('fs');
var csv = require('csv');

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.persons = function (req, res) {
  res.json(persons);
}

exports.personscsv = function (req, res) {

  var persons = {};
  var stream = fs.createReadStream(__dirname + '/../data/persons.csv');

  csv()
    .from(stream)
    .transform(function(row) {
      var newRow = {
        id: row[0],
        klasse: row[1],
        lastname: row[2],
        firstname: row[3],
        rookie: row[4],
        zip: row[5],
        city: row[6],
        club: row[7],
        birthday: row[8],
        oldLicence: row[9]
      };
      return newRow;
    })
    .on('record', function(row, index) {
      if (index > 0) {
        persons['csv-' + index] = row;
      }
    })
    .on('end', function(count){
      //console.log(persons);
      console.log('Found %d items.', count);
      res.json(persons);
    })
    .on('error', function(err){
      console.log(error.message);
      res.send(500, 'Something broke!');
    });
}
