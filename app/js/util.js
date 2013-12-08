/**
 * @file
 * Custom utility functions and objects.
 *
 * Some of them may be provided as angularjs providers later.
 */

var openKSUtil = {};

/**
 * Provide an object to manage the view history.
 *
 * @param {array} templateOptions
 *   array of template definitions holding:
 *   - key: the machine name for the view
 *   - title: the human readable name for the title
 *   - url: url for the template
 * @param {string} id
 *   ID for storage
 */
openKSUtil.navObject = function (templateOptions, id) {

  // Private properties:
  // Storage ID to be used for local storage.
  var storageId = 'navObject-' + id;

  // Set as local variable for
  var nav = this;

  // Public properties:
  this.templates = {};
  this.currentView = undefined;
  this.history = [];
  this.future = [];

  /**
   * Helper to filter an array to only use objects.
   * @param val
   * @returns {boolean}
   */
  var objArrFilter = function (val) {
    return angular.isObject(val);
  }

  /**
   * Private cunction to convert template object in usable template storage.
   * @param templateOptions
   */
  var initTemplates = function (templateOptions) {
    // Ensure empty template registry.
    nav.templates = {};

    // key the template store be the key.
    for (var i in templateOptions) {
      var tpl = templateOptions[i];

      nav.templates[tpl.key] = tpl;
    }
  }

  // And directly initialise them.
  initTemplates(templateOptions);

  /**
   * Clears the whole history.
   */
  this.clear = function() {
    nav.history = [];
    nav.future = [];
  }

  /**
   * Retrieve the current view specs.
   *
   * @returns {*}
   */
  this.getCurrentView = function() {
    return nav.currentView;
  }

  /**
   * Change the view with an optional list of arguments.
   *
   * @code
   *   nav.setView('driverAdd', 'new');
   * @endcode
   *
   * @param {string} key
   *   Machine name of the view to set as current.
   * @param ...
   *   Additional arguments to pass, that can be retrieved for the current view
   *   via getArg(num), with num starting from 0.
   */
  this.setView = function(key) {
    // 'arguments' is no real array, so we have to build one first to shift
    // the first argument - which is the key - and pass the rest as context to
    // the current view.
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    nav.setViewByArgs(key, args);
  }

  /**
   * Change the view with a given array of arguments.
   *
   * Example usage:
   * @code
   *   nav.setViewByArgs('driverAdd', ['new']);
   * @endcode
   *
   * @param {string} key
   *   Machine name of the view to set as current.
   * @param {Array} args
   *   Additional arguments to pass, that can be retrieved for the current view
   *   via getArg(num), with num starting from 0.
   */
  this.setViewByArgs = function(key, args) {
    // Only process if the given view exists.
    if (nav.templates[key] != undefined) {

      // Do nothing, if the current view has not changed.
      if (nav.currentView != undefined && nav.currentView.key == key
        && angular.toJson(nav.currentView.args) == angular.toJson(args)) {
        return;
      }

      // Set the current view as history (if we really have one already).
      if (nav.currentView != undefined) {
        nav.history.push(nav.currentView);
        nav.history = nav.history.filter(objArrFilter);
      }

      // Write the given key as new view.
      nav.currentView = nav.templates[key];
      // We add the instance args
      nav.currentView.args = args;

      // We reset the future, as we set a new view.
      nav.future = [];

      // Finally save our new view state.
      nav.save(function() {
        console.log('View setted and stored:', key);
        console.log(args);
      });
    }
  }

  /**
   * Retrieve argument from the current view instance.
   *
   * @param {int} num
   *
   * @returns {*}
   */
  this.getArg = function(num) {
    if (nav.hasArg(num)) {
      return nav.currentView.args[num];
    }
  }

  /**
   * Check if the given arg is available.
   *
   * @param {int} num
   * @returns {boolean}
   */
  this.hasArg = function(num) {
    return nav.currentView.args[num] != undefined;
  }

  /**
   * Sets a concrete view, if none is set.
   *
   * @param {string} key
   *   Machine name of the view to set as current.
   */
  this.setDefaultView = function(key) {
    if (nav.currentView == undefined) {
      nav.setView(key);
    }
  }

  /**
   * Check if we got history entries.
   *
   * @returns {boolean}
   */
  this.hasHistory = function() {
    return nav.history.length > 0;
  }

  /**
   * Check if we got future entries.
   *
   * @returns {boolean}
   */
  this.hasFuture = function() {
    return nav.future.length > 0;
  }

  /**
   * Set the current view as last view from the history.
   */
  this.goBack = function() {

    // We can only go back, if there is a history.
    if (nav.hasHistory()) {

      // The current view goes in the future.
      if (nav.currentView != undefined) {
        nav.future.push(nav.currentView);
      }

      // Get the last entry from the history and set it as current view.
      nav.currentView = nav.history.pop();
    }
  }

  /**
   * Go to a future entry, if there is some.
   */
  this.goForward = function() {
    // We can only go forward, if there is  future.
    if (nav.hasFuture()) {

      // The current view goes back in the history.
      if (nav.currentView != undefined) {
        nav.history.push(nav.currentView);
      }

      // Get the next entry from the future and set it as current view.
      nav.currentView = nav.future.pop();
    }
  }

  /**
   * Load settings from chrome app local storage.
   *
   * @param Function callback
   */
  this.load = function (callback) {
    chrome.storage.local.get(storageId, function(items) {
      console.log('Local nav loaded');
      console.log(items);

      // If we got our storage, we can set the stored state.
      if (items[storageId] != undefined) {
        var store = angular.fromJson(items[storageId]);

        nav.templates = store.templates;
        nav.currentView = store.currentView;
        nav.history = store.history;
        nav.future = store.future;
      }

      callback();
    });
  };

  /**
   * Save settings to local storage.
   * @param callback
   *
   * @todo: limit history to a maximum length to avoid storage overflow
   */
  this.save = function(callback) {
    var store = {};
    store[storageId] = angular.toJson(nav);
    chrome.storage.local.set(store, function() {
      console.log('Local nav saved.', chrome.runtime.lastError);
      callback();
    });
  }

};

