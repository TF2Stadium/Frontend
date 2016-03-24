/*global describe,beforeEach,sinon,inject,it,expect */

describe('Service: Notifications', function () {
  var Notifications, $rootScope, $q;
  var mock$mdToast, mock$window, mockNgAudio;
  var toastShowPromise, hasFocus;

  beforeEach(function () {
    hasFocus = true;

    mock$window = {
      document: {
        hasFocus: function () { return hasFocus; },
        querySelector: function () {}
      }
    };

    mockNgAudio = sinon.stub({
      play: function () { return -1; }
    });

    angular.mock.module('tf2stadium.services', function ($provide) {
      mock$mdToast = {
        show: sinon.spy(function () {
          return toastShowPromise;
        }),
        hide: sinon.spy()
      };

      $provide.value('$window', mock$window);
      $provide.value('$mdToast', mock$mdToast);
      $provide.value('ngAudio', mockNgAudio);
    });

    inject(function (_Notifications_, _$rootScope_, _$q_) {
      $rootScope = _$rootScope_;
      Notifications = _Notifications_;
      $q = _$q_;

      toastShowPromise = $q.when('');
    });

    // dummy changes to appease the linter
    $rootScope.$emit('a');
    mock$window.location = 1;
    mock$window.location = 1;
  });

  describe('toast()', function () {
    it('should open a toast', function () {
      Notifications.toast({});
      expect(mock$mdToast.show).to.be.calledOnce;
    });

    it('should call the action callback if the controller returns ok', function () {
      var action = sinon.spy();

      toastShowPromise = $q.when('ok');
      Notifications.toast({ action: action });

      // Neeeded for $q promises to go through
      $rootScope.$digest();

      expect(action).to.be.calledOnce;
    });

    it('should not call the action callback if the controller doesn\'t returns ok', function () {
      var action = sinon.spy();

      toastShowPromise = $q.when('');
      Notifications.toast({ action: action });

      // Neeeded for $q promises to go through
      $rootScope.$digest();

      expect(action).to.not.be.called;
    });
  });

  describe('titleNotification()', function () {
    it('should not set rootScope flag if document isn\'t focused', function () {
      hasFocus = true;
      Notifications.titleNotification();
      expect($rootScope.titleNotification).to.be.false;
    });

    it('should set rootScope flag if document isn\'t focused', function () {
      hasFocus = false;
      Notifications.titleNotification();
      expect($rootScope.titleNotification).to.be.true;
    });
  });

});
