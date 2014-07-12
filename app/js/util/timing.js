'use strict';

/**
 * @file
 * Provides object for holding timing information.
 */

/**
 * Provide derhasi namespace.
 */
var derhasi = derhasi || {};

/**
 *
 * @param port
 *
 * @constructor
 */
derhasi.timing = function() {

  /**
   * Serial connection.
   * @type {derhasi.chromeSerial}
   */
  this.serial = undefined;

  /**
   *
   * @type {string}
   * @private
   */
  this._tempData = '';

  /**
   * Collected timingData.
   *
   * @type {derhasi.timingData}
   */
  this.data = [];
}

derhasi.timing.prototype.connect = function(port, callback) {
  var _obj = this;

  var cSerial = new derhasi.chromeSerial(port);
  // First connect to the serial...
  cSerial.connect(
    function(err, serial) {
      _obj.serial = serial;

      // When we got a successfuly connection, we first send empty data.
      callback(undefined, undefined);

      // ... and then listen.
      _obj.serial.listen(function(err, data) {
        // The received data is added to our current temp data string.
        _obj._tempData += data;

        // We create an array of data lines.
        var lines = derhasi.timingData.splitDataStrings(_obj._tempData);

        // We always keep the last row, as there might be coming more info
        // that completes the row with a carriage return.
        _obj._tempData = lines.pop();

        for (var no in lines) {
          var tData = new derhasi.timingData(lines[no]);
          // We push to the global list ...
          _obj.data.push(tData);
          // And pass the value to our event callback.
          callback(undefined, tData);
        }

      });
    }
  );
}

/**
 *
 * @param dataString
 */
derhasi.timingData = function(dataString) {

  // type {1,2}
  // class {3}
  // -blank- {2}
  // concurrent {4}
  // -blank- {1}
  // input 1 or 2 {2}
  // -blank- {1}
  // time {15}
  // CR {1}

  this._string = dataString;
  this.len = dataString.length;

  this.type = '';
  this.class = '';
  this.concurrent = '';
  this.input = '';
  this.time = '';
}

/**
 * Static callback to split a data string line by line.
 *
 * @param {String} dataString
 * @returns {Array}
 */
derhasi.timingData.splitDataStrings = function(dataString) {
  var lines = dataString.split(/\r\n|\r|\n/g);
  return lines;
}

/**
 * Callback returning a ports list.
 * @callback derhasi.timingDataCallback
 * @param {} error
 * @param {derhasi.timingData} tData
 */
