/*
 * Serve JSON to our AngularJS client
 */

var fs = require('fs');
var csv = require('csv');
var config = require('../models/config');
var driver = require('../models/driver');
var result = require('../models/result');

/**
 * Route callback to show all drivers as JSON.
 *
 * @param req
 * @param res
 */
exports.getDrivers = function (req, res) {
  // Output the list of drivers.
  driver.list(function (err, drvs) {
    if (err) {
      console.log(err);
    }
    res.json(drvs);
  });
}

/**
 * Endpoint for getting a driver object from the stored json.
 *
 * @param req
 * @param res
 */
exports.getDriver = function(req, res) {
  driver.get(req.params.driverId, function (err, drv) {
    if (err) {
      console.log('Error retrieving driver: ', err);
      res.status(404).send('No driver found');
    }
    else if (!drv) {
      res.status(404).send('No driver found');
    }
    else {
      res.json(drv);
    }
  });
}

/**
 * Endpoint callback to get an object with a new id.
 *
 * @param req
 * @param res
 */
exports.newDriver = function(req, res) {
  driver.new(function (err, drv) {
    if (err) {
      console.log('Error retrieving new driver: ', err);
    }
    res.json(drv);
  });
}

/**
 * Endpoint callback for saving a driver object.
 * @param req
 * @param res
 */
exports.saveDriver = function(req, res) {
  if (!req.body) {
    res.status('406').send('No object given.');
  }
  else if (req.body.__id == undefined) {
    res.status('406').send('No object __id given');
  }
  else if (req.body.__id != req.params.driverId) {
    res.status('406').send('Param and object id do not match');
  }
  else {
    driver.write(req.body, function(err, drv) {
      if (err) {
        console.log('Error saving driver: ', req.body);
      }
      res.json(drv);
    });
  }
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
    res.json(config.load());
  }
  // We do not have any data to save.
  else {
    res.json(config.load());
  }
}


/**
 * Route callback to show all drivers as JSON.
 *
 * @param req
 * @param res
 */
exports.getResults = function (req, res) {
  // Output the list of results.
  result.list(function (err, rslts) {
    if (err) {
      console.log(err);
    }
    res.json(rslts);
  });
}

/**
 * Endpoint for getting a driver object from the stored json.
 *
 * @param req
 * @param res
 */
exports.getResult = function(req, res) {
  result.get(req.params.driverId, function (err, rslt) {
    if (err) {
      console.log('Error retrieving result: ', err);
      res.status(404).send('No result found');
    }
    else if (!rslt) {
      res.status(404).send('No result found');
    }
    else {
      res.json(rslt);
    }
  });
}

/**
 * Endpoint callback to get an object with a new id.
 *
 * @param req
 * @param res
 */
exports.newResult = function(req, res) {
  result.new(function (err, rslt) {
    if (err) {
      console.log('Error retrieving new driver: ', err);
    }
    res.json(rslt);
  });
}

/**
 * Endpoint callback for saving a driver object.
 * @param req
 * @param res
 */
exports.saveResult = function(req, res) {
  if (!req.body) {
    res.status('406').send('No object given.');
  }
  else if (req.body.__id == undefined) {
    res.status('406').send('No object __id given');
  }
  else if (req.body.__id != req.params.id) {
    res.status('406').send('Param and object id do not match');
  }
  else {
    result.write(req.body, function(err, rslt) {
      if (err) {
        console.log('Error saving driver: ', req.body);
      }
      res.json(rslt);
    });
  }
}
