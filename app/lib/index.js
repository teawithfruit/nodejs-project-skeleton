'use strict';

var Q = require('q');
var handlebars = require('handlebars');
var request = require('request');

(function(exports) {

  exports.skeleton = function() {
    return 'Hello World!';
  };

})(typeof exports === 'undefined' ? this['module'] = {} : exports);