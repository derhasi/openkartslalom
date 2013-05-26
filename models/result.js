var fs = require('fs');
var config = require('./config');

const resultCurrentJSONPath = "data/current/results.json";

/**
 * Get all results in an array.
 *
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Array: array of the result objects
 */
exports.list = function(callback) {

  // If there is a driver json, we use it directly.
  if (fs.existsSync(resultCurrentJSONPath)) {
    console.log('drivers.json found in data/current.');
    fs.readFile(resultCurrentJSONPath, function(err, content) {
      if (err) {
        console.log('Error on reading %s: ', resultCurrentJSONPath, err);
      }
      callback(null, JSON.parse(content));
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
 *  - Object: a driver objectw
 */
exports.get = function(id, callback) {
  this.list(function (err, results) {
    if (err) {
      callback(err);
    }
    // Run through the list of drivers
    for (var key in results) {
      if (results[key].id == id) {
        callback(null, results[key]);
        return;
      }
    }

    callback(new Error('Result not found'));
  });
}

/**
 * Get a new empty result.
 *
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Object: a result object
 */
exports.new = function(callback) {
  this.list(function (err, results) {
    if (err) {
      callback(err);
    }

    // Get the next id by running through all ids.
    var max = 0;
    for (var i in results) {
      if (results[i].id && results[i].id > max) {
        max = results[i].id;
      }
    }

    // Simply pass an empty object with a N00000 id.
    callback(null, {
      "id": max + 1,
      "v": 0
    });
  });
}


/**
 * Write a result object back to the results json.
 *
 * @param obj
 *   The result object (new or to update).
 * @param callback
 *  Provides:
 *  - err: error object
 *  - Object: a result object
 */
exports.write = function(obj, callback) {
  this.list(function (err, results) {
    if (err) {
      callback(err);
    }

    if (obj.id == undefined) {
      callback(new Error('No id given for the object.'));
      return;
    }

    // Update revision by 1.
    obj.v += 1;
    // @todo: add created and changed attributes

    var found = false;
    // Run through the list of drivers, and replace the object having the same
    // __id with the new one.
    for (var key in results) {
      if (results[key].id == obj.id) {
        results[key] = obj;
        found = true;
        break;
      }
    }

    // If there was no existing entry, simply add id to the end of the list.
    if (!found) {
      results.push(obj);
    }

    // And then we will write the file back.
    fs.writeFile(resultCurrentJSONPath, JSON.stringify(results, null, " "), function(err) {
      callback(err, obj);
    });
  });
}
