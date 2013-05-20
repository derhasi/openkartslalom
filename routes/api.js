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

  // Output the list of drivers.
  driver.list(function (err, drivers) {
    if (err) {
      console.log(err);
    }

    res.json(drivers);

  });
}
