angular.module('tf2stadium.filters')
  .filter('capitalize', capitalize_AngularWrapper)
  .filter('numberOrDash', numberOrDash)
  .filter('reverse', reverse_AngularWrapper)
  .filter('trusted', trusted)
  .filter('stripSlotNameNumber', stripSlotNameNumber_AngularWrapper)
  .filter('slotNameToClassName', slotNameToClassName_AngularWrapper)
  .filter('ifNumeric', ifNumeric)
  .filter('secondsToMinutes', secondsToMinutes_AngularWrapper)
  .filter('unique', unique)
  .filter('greaterThan', greaterThan);

export function capitalize(input) {
  if (angular.isUndefined(input) || input === '') {
    return input;
  }
  return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
}

/** @ngInject */
function capitalize_AngularWrapper() {
  return capitalize;
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
    return (+input) === 0 ? dash : numberFilter(input);
  };
}

export function reverse(items) {
  return items.slice().reverse();
}

/** @ngInject */
function reverse_AngularWrapper() {
  return reverse;
}

/** @ngInject */
function trusted($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}

export function stripSlotNameNumber(slotName) {
  return slotName.replace(/\d+$/, '');
}

/** @ngInject */
function stripSlotNameNumber_AngularWrapper() {
  return stripSlotNameNumber;
}

var classSynonyms = {
  roamer: 'soldier',
  pocket: 'soldier',
};

export function slotNameToClassName(slotName) {
  slotName = stripSlotNameNumber(slotName);

  var className = slotName;
  if (classSynonyms.hasOwnProperty(slotName)) {
    className = classSynonyms[slotName];
  }

  return className;
}

/** @ngInject */
function slotNameToClassName_AngularWrapper() {
  return slotNameToClassName;
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

export function secondsToMinutes(seconds) {
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ':' + seconds;
}

/** @ngInject */
function secondsToMinutes_AngularWrapper() {
  return secondsToMinutes;
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
