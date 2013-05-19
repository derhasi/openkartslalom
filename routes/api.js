/*
 * Serve JSON to our AngularJS client
 */

var fs = require('fs');
var csv = require('csv');
var config = require('../models/config');

/**
 * Route callback to show all drivers as JSON.
 *
 * @param req
 * @param res
 */
exports.drivers = function (req, res) {

  var driverCSVPath = config.get("driversCSV");

  if (fs.existsSync('data/current/drivers.json')) {
    console.log('drivers.json found in data/current.');
    var drivers = require('../data/current/drivers.json');
    res.json(drivers);
  }
  else if (driverCSVPath && fs.existsSync(driverCSVPath)) {
    importdriversCSV('data/import/drivers.csv', 'data/current/drivers.json', function(err, count) {
      if (err) {
        console.log('Error on converting drivers.csv to drivers.json: ', err);
        res.json({});
      }
      else {
        console.log('Converted %s to drivers.json.', driverCSVPath);
        var content = fs.readFileSync('data/current/drivers.json');
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
function importdriversCSV(fromPath, toPath, callback) {

  var drivers = [];
  var stream = fs.createReadStream(fromPath);
  var mapping = config.get("driversCSVMapping");
  var headerCount = config.get("driversCSVHeaderCount");

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
        drivers.push(row);
      }
    })
    .on('end', function(count){
      fs.writeFileSync(toPath, JSON.stringify(drivers, null, " "));
      callback(null, count);
    })
    .on('error', function(err){
      callback(err, null)
    });
}


