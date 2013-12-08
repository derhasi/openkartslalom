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
 */
openKSUtil.navObject = function (templateOptions) {

  // Set as local variable for
  var nav = this;

  this.templates = {};
  this.currentView = undefined;
  this.history = [];
  this.future = [];

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
   * Change the view.
   *
   * @param {string} key
   *   Machine name of the view to set as current.
   *
   * @todo: provide arguments
   */
  this.setView = function(key) {

    // Only process if the given view exists.
    if (nav.templates[key] != undefined) {

      // Set the current view as history.
      if (nav.currentView != undefined) {
        nav.history.push(nav.currentView);
      }

      // Write the given key as new view.
      nav.currentView = nav.templates[key];

      // We reset the future, as we set a
      nav.future = [];
    }
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

};

