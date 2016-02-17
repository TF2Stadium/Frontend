(function () {
  'use strict';

  angular.module('tf2stadium.filters')
    .filter('capitalize', capitalize)
    .filter('numberOrDash', numberOrDash)
    .filter('reverse', reverse)
    .filter('trusted', trusted)
    .filter('stripSlotNameNumber', stripSlotNameNumber)
    .filter('slotNameToClassName', slotNameToClassName)
    .filter('ifNumeric', ifNumeric)
    .filter('secondsToMinutes', secondsToMinutes)
    .filter('unique', unique)
    .filter('greaterThan', greaterThan);

  /** @ngInject */
  function capitalize() {
    return function (input) {
      if (angular.isUndefined(input) || input === '') {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
  }

  /** @ngInject */
  function numberOrDash($filter) {
    var numberFilter = $filter('number');

    return function (input, dash) {
      if (angular.isUndefined(dash)) {
        dash = '-';
      }

      if (angular.isUndefined(input) || isNaN(input)) {
        return input;
      }
      return (+input) === 0? dash : numberFilter(input);
    };
  }

  /** @ngInject */
  function reverse() {
    return function (items) {
      return items.slice().reverse();
    };
  }

  /** @ngInject */
  function trusted($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

  /** @ngInject */
  function stripSlotNameNumber() {
    return function (slotName) {
      return slotName.replace(/\d+$/, '');
    };
  }

  /** @ngInject */
  function slotNameToClassName() {
    var classSynonyms = {
      roamer: 'soldier',
      pocket: 'soldier'
    };

    var stripNumberFilter = stripSlotNameNumber();

    return function (slotName) {
      slotName = stripNumberFilter(slotName);

      var className = slotName;
      if (classSynonyms.hasOwnProperty(slotName)) {
        className = classSynonyms[slotName];
      }

      return className;
    };
  }

  /** @ngInject */
  function ifNumeric() {
    return function (str, out) {
      // only intended for string inputs, and only intended to output
      // 'out' if the string represents an integer
      if (angular.isNumber(str) || /^\d+$/.test(str)) {
        return out;
      } else {
        return '';
      }
    };
  }

  /** @ngInject */
  function secondsToMinutes() {
    return function (seconds) {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
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

  /** @ngInject */
  function greaterThan() {
    return function greaterThanImpl(items, prop, val) {
      return items.filter(function (item) {
        return item[prop] > val;
      });
    };
  }

})();
