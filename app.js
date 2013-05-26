
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

// Configuration
var config = require('./models/config');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/drivers', api.getDrivers);
app.get('/api/driver/new', api.newDriver);
app.get('/api/driver/:driverId', api.getDriver);
app.put('/api/driver/:driverId', api.saveDriver);

app.get('/api/config', api.getConfig);
app.put('/api/config', api.setConfig);

app.get('/api/result/query', api.getResults);
app.get('/api/result/new', api.newResult);
app.get('/api/result/:id', api.getResult);
app.put('/api/result/:id', api.saveResult);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
