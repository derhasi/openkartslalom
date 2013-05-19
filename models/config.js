
const configCurrentPath = 'data/current/config.json';
const configDefaultPath = 'data/defaults/config.json';

var nconf = require('nconf');

// First load the defaults ...
nconf.file(configCurrentPath)
  .file("defaults", {file: configDefaultPath});

module.exports = nconf;
