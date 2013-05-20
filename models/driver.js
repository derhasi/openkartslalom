
var fs = require('fs');
var csv = require('csv');
var config = require('./config');

const driverCurrentJSONPath = "data/current/drivers.json";

/**
 * Get all drivers in an array.
 *
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Array: array of the driver objects
 */
exports.list = function(callback) {

  var driverCSVPath = config.get("driversCSV");

  // todo: do some more asynch?
  // If there is a driver json, we use it directly.
  if (fs.existsSync(driverCurrentJSONPath)) {
    console.log('drivers.json found in data/current.');
    fs.readFile(driverCurrentJSONPath, function(err, content) {
      if (err) {
        console.log('Error on reading %s: ', driverCurrentJSONPath, err);
      }
      callback(null, JSON.parse(content));
    });
  }
  // Else we try to import the list from an existing csv file.
  else if (driverCSVPath && fs.existsSync(driverCSVPath)) {
    importCSV(driverCSVPath, driverCurrentJSONPath, function(err, count) {
      if (err) {
        console.log('Error on converting drivers.csv to drivers.json: ', err);
        callback(err, []);
      }
      else {
        console.log('Converted %s to drivers.json.', driverCSVPath);
        fs.readFile(driverCurrentJSONPath, function(err, content) {
          if (err) {
            console.log('Error on reading %s: ', driverCurrentJSONPath, err);
          }
          callback(null, JSON.parse(content));
        });
      }
    });
  }
  // Otherwise we have simply no data.
  else {
    callback(null, []);
  }
}

/**
 * Get a driver object for the given id.
 *
 * @param id
 *   ID of the driver
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Object: a driver object
 */
exports.get = function(driverId, callback) {
  this.list(function (err, drivers) {
    if (err) {
      callback(err);
    }
    // Run through the list of drivers
    for (var key in drivers) {
      if (drivers[key].__id == driverId) {
        callback(null, drivers[key]);
        return;
      }
    }

    callback(new Error('Driver not found'));
  });
}

/**
 * Get a new empty driver.
 *
 * @param callback
 */
exports.new = function(callback) {
  this.list(function (err, drivers) {
    if (err) {
      callback(err);
    }

    var l = drivers.length;
    // Simply pass an empty obejct
    callback(null, {
      "__id": "new-" + l,
      "id": "N" + l
    });
  });
}

/**
 * Helper function to convert a csv file to json.
 *
 * @param fromPath
 * @param toPath
 * @param callback
 */
function importCSV(fromPath, toPath, callback) {

  var drivers = [];
  var stream = fs.createReadStream(fromPath);
  var mapping = config.get("driversCSVMapping");
  var headerCount = config.get("driversCSVHeaderCount");

  csv()
    .from(stream)
    .transform(function(row) {
      var newRow = {};

      for (var i in mapping) {
        var map = mapping[i];
        if (map.index >= 0) {
        newRow[map.column] = row[map.index];
        }
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
