
var fs = require('fs');
var csv = require('csv');
var config = require('./config');
var str = require('string');

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
 *  Provides:
 *  - err: error object
 *  - Object: a driver object
 */
exports.new = function(callback) {
  this.list(function (err, drivers) {
    if (err) {
      callback(err);
    }


    var l = drivers.length;
    // Simply pass an empty object with a N00000 id.
    callback(null, {
      "__id": "new-" + l,
      "id": getNewIDFromDrivers(drivers)
    });
  });
}

/**
 * Helper to get a new key from the drivers array.
 *
 * @param Array drivers
 * @returns {string}
 */
function getNewIDFromDrivers(drivers) {
  var l = drivers.length;

  return "N" + str(l).padLeft(5, "0");
}

/**
 * Write a driver object back to the drivers json.
 *
 * @param obj
 *   The driver object (new or to update).
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Object: a driver object
 */
exports.write = function(obj, callback) {
  this.list(function (err, drivers) {
    if (err) {
      callback(err);
    }

    if (obj.__id == undefined) {
      callback(new Error('No __id given for the object.'));
      return;
    }

    // If the ID is empty we get the auto-id.
    if (obj.id == "") {
      obj.id = getNewIDFromDrivers(drivers);
    }

    // Update revision by 1.
    obj.v += 1;
    // @todo: add created and changed attributes

    var found = false;
    // Run through the list of drivers, and replace the object having the same
    // __id with the new one.
    for (var key in drivers) {
      if (drivers[key].__id == obj.__id) {
        drivers[key] = obj;
        found = true;
        break;
      }
    }

    // If there was no existing entry, simply add id to the end of the list.
    if (!found) {
      drivers.push(obj);
    }

    // And then we will write the file back.
    fs.writeFile(driverCurrentJSONPath, JSON.stringify(drivers, null, " "), function(err) {
      callback(err, obj);
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
        row.v = 1;
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
