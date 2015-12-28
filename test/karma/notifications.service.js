/*global describe,beforeEach,sinon,module,inject */

describe('Service: Notifications', function () {
  'use strict';

  var Notifications, $rootScope;
  var mock$mdToast, mock$window;

  beforeEach(function () {
    mock$window = sinon.stub({});

    mock$mdToast = sinon.stub({
      show: function () { return -1; },
      hide: function () { return -1; }
    });

    module('tf2stadium.services', function ($provide) {
      $provide.value('$mdToast', mock$mdToast);
    });

    inject(function (_Notifications_, _$rootScope_) {
      $rootScope = _$rootScope_;
      Notifications = _Notifications_;
    });

    // dummy changes to appease the linter
    Notifications.x = 1;
    $rootScope.$emit('a');
    mock$window.location = 1;
    mock$window.location = 1;
  });

});
