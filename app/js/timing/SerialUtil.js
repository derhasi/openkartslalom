'use strict';

/**
 * @file
 * Provides wrapper for the chrome serial API.
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
derhasi.chromeSerial = function(port) {

  this.port = port;
  this.bitrate = 9600;
  this.connectionId = undefined;

  this.data = [];
  this.listening = false;

};

/**
 * Checks if the current timing object has already been connected.
 * @returns {boolean}
 */
derhasi.chromeSerial.prototype.isConnected = function() {
  return (this.connectionId > 0);
}

/**
 * Connect the object to the provided port.
 *
 * @param {derhasi.chromeSerialCallback} callback
 *   Callback providing the updated timing object, when connection is opened.
 */
derhasi.chromeSerial.prototype.connect = function(callback) {
  var obj = this;

  // Connect to the given port.
  chrome.serial.open(this.port.path, {bitrate: this.bitrate}, function(connectionInfo) {
    console.log('Connection Info', connectionInfo);
    obj.connectionId = connectionInfo.connectionId;

    if (callback != undefined) {
      callback(undefined, obj);
    }
  });
}

/**
 * Close connection to the current port.
 *
 * @param {derhasi.chromeSerialCallback} callback
 *   Callback providing the updated timing object, when connection is closed.
 */
derhasi.chromeSerial.prototype.disconnect = function(callback) {
  var obj = this;

  chrome.serial.close(obj.connectionId, function(success) {
    console.log('Connection closed:', obj.connectionId, success);
    obj.connectionId = undefined;
    callback(undefined, obj);
  });
}

/**
 *
 * @param callback
 */
derhasi.chromeSerial.prototype.listen = function(callback) {

  // Reference to object, so we can use it within the private function.
  var obj = this;

  var readFromSerial = function() {

    chrome.serial.read(obj.connectionId, obj.bitrate, function(chunk) {
      // If there is some data, we read it.
      if (chunk.bytesRead != undefined && chunk.bytesRead > 0) {

        // Use byteBuffer to read string from the chunk input.
        var buffer = dcodeIO.ByteBuffer.wrap(chunk.data);
        var str = buffer.readUTF8StringBytes(chunk.bytesRead);

        obj.data.push(str);

        callback(undefined, str);

        // Read till we got no result anymore.
        readFromSerial();
      }
      // Else we wait for data to come.
      else {
        console.log('No serial data available.');

        // Read if we are still in listen mode.
        if (obj.listening > 0) {
          console.log('Idle but listening again in 2 seconds.');

          setTimeout(readFromSerial, 2000);
        }
      }
    });

  };

  // Mark the object as listening ...
  this.listening = true;
  // ... and init the read loop.
  readFromSerial();

}

derhasi.chromeSerial.prototype.unlisten = function() {
  this.listening = false;
}

/**
 * Retrieve port objects array for the available ports.
 *
 * @param {derhasi.chromeSerialPortsCallback} callback
 *   Callback function providing an array of port objects.
 *
 * @static
 */
derhasi.chromeSerial.getPorts = function(callback) {
  chrome.serial.getPorts(function(ports) {
    console.log('Ports', ports);
    var returnPorts = [];
    for (var i in ports) {
      returnPorts.push(new derhasi.chromeSerialPort(ports[i]));
    }
    // Pass the retrieved port names
    callback(undefined,returnPorts);
  });
}

/**
 * Provides a new port object.
 *
 * @param {string} portPath
 *   Path for the given port.
 *
 * @constructor
 */
derhasi.chromeSerialPort = function(portPath) {
  this.path = portPath;
}

/**
 * Callback returning an updated serial object.
 * @callback derhasi.chromeSerialCallback
 * @param {} error
 * @param {derhasi.chromeSerial} serial
 */

/**
 * Callback returning a ports list.
 * @callback derhasi.chromeSerialPortsCallback
 * @param {} error
 * @param {derhasi.chromeSerialPort}[] serial
 */
