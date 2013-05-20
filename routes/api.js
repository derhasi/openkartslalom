/*
 * Serve JSON to our AngularJS client
 */

var fs = require('fs');
var csv = require('csv');
var config = require('../models/config');
var driver = require('../models/driver');

/**
 * Route callback to show all drivers as JSON.
 *
 * @param req
 * @param res
 */
exports.getDrivers = function (req, res) {

  var driverCSVPath = config.get("driversCSV");

  if (fs.existsSync('data/current/drivers.json')) {
    console.log('drivers.json found in data/current.');
    var drivers = require('../data/current/drivers.json');
    res.json(drivers);
  }
  else if (driverCSVPath && fs.existsSync(driverCSVPath)) {
    driver.importCSV('data/import/drivers.csv', 'data/current/drivers.json', function(err, count) {
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
