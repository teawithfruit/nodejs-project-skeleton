'use strict';

(function(exports) {

  exports.skeleton = function() {
    return 'Hello World!';
  };

})(typeof exports === 'undefined' ? this['module'] = {} : exports);