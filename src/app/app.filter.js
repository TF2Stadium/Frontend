(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.filter('capitalize', capitalize);
  app.filter('reverse', reverse);
  app.filter('trusted', trusted);
  app.filter('slotNameToClassName', slotNameToClassName);
  app.filter('stripSlotNameNumber', stripSlotNameNumber);
  app.filter('secondsToMinutes', secondsToMinutes);
  app.filter('unique', unique);

  /** @ngInject */
  function capitalize() {
    return function(input) {
      if(typeof input === 'undefined' || input === '') {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
  }

  /** @ngInject */
  function reverse(){
    return function(items) {
      return items.slice().reverse();
    };
  }

  /** @ngInject */
  function trusted($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

  /** @ngInject */
  function stripSlotNameNumber() {
    return function(slotName) {
      return slotName.replace(/\d+$/, "");
    };
  }

  /** @ngInject */
  function slotNameToClassName() {
    var classSynonyms = {
      roamer: 'soldier',
      pocket: 'soldier'
    };

    var stripNumberFilter = stripSlotNameNumber();

    return function(slotName) {
      slotName = stripNumberFilter(slotName);

      var className = slotName;
      if (classSynonyms.hasOwnProperty(slotName)) {
        className = classSynonyms[slotName];
      }

      return className;
    };
  }

  /** @ngInject */
  function secondsToMinutes() {
    return function(seconds) {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return minutes + ':' + seconds;
    };
  }

  /** @ngInject */
  function unique() {
    return function (array, uniqueKey) {
      var uniqueArray = [];
      for (var key in array) {
        var existsInArray = false;
        for (var j in uniqueArray) {
          if (uniqueArray[j][uniqueKey] === array[key][uniqueKey]) {
            existsInArray = true;
          }
        }
        if (!existsInArray) {
          uniqueArray.push(array[key]);
        }
      }
      return uniqueArray;
    };
  }

})();
