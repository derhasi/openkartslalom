/*
 * Serve JSON to our AngularJS client
 */

var fs = require('fs');
var csv = require('csv');
var config = require('../models/config');

/**
 * Route callback to show all persons as JSON.
 *
 * @param req
 * @param res
 */
exports.persons = function (req, res) {

  var personCSVPath = config.get("personsCSV");

  if (fs.existsSync('data/current/persons.json')) {
    console.log('persons.json found in data/current.');
    var persons = require('../data/current/persons.json');
    res.json(persons);
  }
  else if (personCSVPath && fs.existsSync(personCSVPath)) {
    importPersonsCSV('data/import/persons.csv', 'data/current/persons.json', function(err, count) {
      if (err) {
        console.log('Error on converting persons.csv to persons.json: ', err);
        res.json({});
      }
      else {
        console.log('Converted %s to persons.json.', personCSVPath);
        var content = fs.readFileSync('data/current/persons.json');
        res.json(JSON.parse(content));
      }
    });
  }
  else {
    res.json({});
  }

}

/**
 * Helper function to convert a csv file to json.
 *
 * @param fromPath
 * @param toPath
 * @param callback
 */
function importPersonsCSV(fromPath, toPath, callback) {

  var persons = [];
  var stream = fs.createReadStream(fromPath);
  var mapping = config.get("personsCSVMapping");
  var headerCount = config.get("personsCSVHeaderCount");

  csv()
    .from(stream)
    .transform(function(row) {
      var newRow = {};

      for (var key in mapping) {
        var index = mapping[key];
        newRow[key] = row[index];
      }
      return newRow;
    })
    .on('record', function(row, index) {
      if (index >= headerCount) {
        row.__id = 'csv-' + index;
        persons.push(row);
      }
    })
    .on('end', function(count){
      fs.writeFileSync(toPath, JSON.stringify(persons, null, " "));
      callback(null, count);
    })
    .on('error', function(err){
      callback(err, null)
    });
}


