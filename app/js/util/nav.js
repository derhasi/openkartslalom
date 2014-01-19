'use strict';

/**
 * Provide an object to manage the view history.
 *
 * @param {array} templateOptions
 *   array of template definitions holding:
 *   - key: the machine name for the view
 *   - title: the human readable name for the title
 *   - url: url for the template
 *   - parent: (optional) key of a template that will point to the parent entry
 *
 * @param {string} id
 *   ID for storage
 */
function openKSUtilNav(templateOptions, id) {

  // Private properties:
  // Storage ID to be used for local storage.
  var storageId = 'navObject-' + id;
  // Templates are held private as only that init call shall define them.
  var templates = {};

  // Set as local variable for
  var nav = this;

  // Public properties:
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
    templates = {};

    // key the template store be the key.
    for (var i in templateOptions) {
      var tpl = templateOptions[i];

      templates[tpl.key] = tpl;
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
    initTemplates(origTemplates);
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
   * Get all template definitions of the parent entries.
   *
   * @returns {Array}
   */
  this.getCurrentParents = function() {

    var parents = [];

    if (nav.currentView == undefined) {
      return parents;
    }

    // Get raw template for the current view.
    var tpl = templates[nav.currentView.key];

    // Get the parent of template, as long as no parent is given anymore.
    while (tpl.parent != undefined  && templates[tpl.parent] != undefined) {
      tpl = templates[tpl.parent];
      parents.unshift(tpl);
    }

    return parents;
  }

  /**
   * Checks if the given key, is the active view.
   * @param key
   * @returns {boolean}
   */
  this.isActive = function (key) {
    return nav.currentView != undefined && nav.currentView.key == key;
  }

  /**
   * Check if the given key is in the trail of the currently active view.
   * @param {string} key
   * @returns {boolean}
   */
  this.isActiveTrail = function (key) {
    if (nav.isActive(key)) {
      return true;
    }
    // Check if the given key is part of the current view's parents.
    else {
      var parents = nav.getCurrentParents();
      for (var i in parents) {
        if (parents[i].key == key) {
          return true;
        }
      }
    }
    return false;
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
   * @param {Function} callback
   *   Callback function for when the new view information was saved.
   */
  this.setView = function(key, args, callback) {
    // Only process if the given view exists.
    if (templates[key] != undefined) {

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
      nav.currentView = templates[key];
      // We add the instance args
      nav.currentView.args = args;

      // We reset the future, as we set a new view.
      nav.future = [];

      // Finally save our new view state.
      nav.save(function() {
        console.log('View setted and stored:', key);
        console.log(args);

        // Call the callback, whenever the view was updated.
        callback();
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
  this.getCurrentArg = function(num) {
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
  this.setDefaultView = function(key, callback) {
    if (nav.currentView == undefined) {
      nav.setView(key, [], callback);
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
