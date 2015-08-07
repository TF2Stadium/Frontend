(function() {
  'use strict';

  var app = angular.module('tf2stadium');

  app.filter('reverse', reverse);

  function reverse(){
    return function(items) {
      return items.slice().reverse();
    };
  };
});