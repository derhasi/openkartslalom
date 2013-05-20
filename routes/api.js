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

/**
 * Endpoint to view the whole configuration.
 *
 * @param req
 * @param res
 */
exports.getConfig = function (req, res) {
  res.json(config.load());
}

/**
 * Endpoint to store config back again.
 *
 * @param req
 * @param res
 */
exports.setConfig = function (req, res) {

  console.log(req.body);
  if (req.body) {
    var count = 0;
    for (var key in req.body) {
      config.set(key, req.body[key]);
      count++;
    }
    config.save();
    console.log('Updated %d config items.', count);
    res.json({
      "status": "updated"
    });
  }
  // We do not have any data to save.
  else {
    res.json({
      "status": "empty"
    });
  }
}
