/*global describe,beforeEach,sinon,module,inject,it,expect,afterEach */

describe('Controller: CommentBoxController', function () {
  'use strict';

  var $rootScope, $compile, $scope, $controller, $timeout;
  var mockRooms, mockChatService, mockWindow;
  var ctrl, page, textarea;

  var template =
        '<div ng-controller="CommentBoxController as vm">' +
        '<textarea ng-model="vm.messageBox"></textarea>' +
        '</div>';

  var globalRoomId = 0;

  beforeEach(function () {
    mockRooms = { };
    mockRooms[globalRoomId] = { messages: [], id: globalRoomId };

    mockChatService = sinon.stub({
      getRooms: function () {},
      send: function () {}
    });

    mockChatService.getRooms.returns(mockRooms);

    mockWindow = sinon.stub({
      open: function () {},
      // We need this, or angular internals that do
      // document.createElement, etc., will break
      document: document
    });

    module('tf2stadium.controllers', function ($provide) {
      $provide.value('$window', mockWindow);
      $provide.value('ChatService', mockChatService);
    });

    inject(function (_$rootScope_, _$compile_, _$controller_, _$timeout_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $timeout = _$timeout_;

      $scope = $rootScope.$new();
      $scope.currentTab = 0;
    });
  });

  afterEach(function () {
    $scope.$destroy();
  });

  function setupBareController() {
    ctrl = $controller('CommentBoxController', {
      $scope: $scope
    });
    $timeout.flush();
  }

  function setupPageController() {
    page = $compile(template)($scope);
    $scope.$digest();

    textarea = page.find('textarea');

    ctrl = page.controller();
    $timeout.flush();
  }

  describe('goToProfile()', function () {
    it('should open a profile page', function () {
      setupBareController();

      var steamId = '1234567890';

      ctrl.goToProfile(steamId);

      expect(mockWindow.open).to.be.calledOnce;
      expect(mockWindow.open).to.be.calledWith(
        'http://steamcommunity.com/profiles/' + steamId,
        '_blank'
      );
    });
  });

  describe('sendMessage', function () {
    var mockEvent;

    beforeEach(function () {
      mockEvent = sinon.stub({
        preventDefault: function () {},
        keyCode: 13
      });
    });

    it('should send a short message on Enter', function () {
      setupPageController();

      var msg = 'abc';
      textarea.val(msg).triggerHandler('input');
      $scope.$digest();

      ctrl.sendMessage(mockEvent);
      expect(mockChatService.send).to.be.calledOnce;
      expect(mockChatService.send).to.be.calledWith(msg, globalRoomId);

      $scope.$digest();
      expect(textarea.val()).to.be.empty;
    });

    it('should not send empty messages', function () {
      setupPageController();

      textarea.val('').triggerHandler('input');
      $scope.$digest();

      ctrl.sendMessage(mockEvent);
      expect(mockChatService.send).to.not.be.called;
    });

    it('should not send messages of only whitespace', function () {
      setupPageController();

      textarea.val('   \n\t  ').triggerHandler('input');
      $scope.$digest();

      ctrl.sendMessage(mockEvent);
      expect(mockChatService.send).to.not.be.called;
    });
  });
});
