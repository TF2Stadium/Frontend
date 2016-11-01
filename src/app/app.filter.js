import {property} from 'lodash/fp';

/* @flow */
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
  .filter('notIn', notIn)
  .filter('greaterThan', greaterThan)
  .filter('passwordDisplay', passwordDisplay_AngularWrapper);

export function capitalize(input: ?string) {
  if (angular.isUndefined(input) || !input || input === '') {
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

export function reverse(items: Array<any>) {
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

export function stripSlotNameNumber(slotName: string) {
  return angular.isString(slotName) ? slotName.replace(/\d+$/, '') : slotName;
}

/** @ngInject */
function stripSlotNameNumber_AngularWrapper() {
  return stripSlotNameNumber;
}

var classSynonyms = {
  roamer: 'soldier',
  pocket: 'soldier',
};

export function slotNameToClassName(slotName: string) {
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

export function secondsToMinutes(seconds: number) {
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  var secondsStr = (seconds < 10 ? '0' : '') + seconds;
  return minutes + ':' + seconds;
}

/** @ngInject */
function secondsToMinutes_AngularWrapper() {
  return secondsToMinutes;
}

/** @ngInject */
function unique() {
  return function (array: ?Array<Object>, uniqueKey: string) {
    if (!array) {
      return [];
    }

    return array.reduce(([out, seen], o) => {
      let v = o[uniqueKey];
      if (!seen.has(v)) {
        seen.add(v);
        out.push(o);
      }
      return [out, seen];
    }, [[], new Set()])[0];
  };
}

/** @ngInject */
function notIn() {
  return function (array: Array<Object>, key: String, excludeList: Array<Object>) {
    if (!array) {
      return [];
    }

    const excludeSet = new Set(excludeList.map(property(key)));
    return array.filter(({[key]: s}) => !excludeSet.has(s));
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

export function passwordDisplay(password: string) {
  return password.replace(/./g, '•');
}

/** @ngInject */
function passwordDisplay_AngularWrapper() {
  return passwordDisplay;
}
