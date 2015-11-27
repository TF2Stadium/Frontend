(function () {
  'use strict';

  angular.module('tf2stadium')
    .filter('capitalize', capitalize)
    .filter('reverse', reverse)
    .filter('trusted', trusted)
    .filter('slotNameToClassName', slotNameToClassName)
    .filter('stripSlotNameNumber', stripSlotNameNumber)
    .filter('secondsToMinutes', secondsToMinutes);

  /** @ngInject */
  function capitalize() {
    return function (input) {
      if(typeof input === 'undefined' || input === '') {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
  }

  /** @ngInject */
  function reverse(){
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
  function secondsToMinutes() {
    return function (seconds) {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return minutes + ':' + seconds;
    };
  }

})();
