/* @flow */
require('./spectators.html');
require('./header.html');
require('./lobby-page.html');

angular
  .module('tf2stadium.controllers')
  .controller('LobbyPageController', LobbyPageController);

/** @ngInject */
function LobbyPageController($q, $mdDialog, $scope, $state, $window,
                             $timeout: AngularJSTimeout, $interval, safeApply, LobbyService) {
  var vm = this;
  var lobbyPageId = parseInt($state.params.lobbyID);

  LobbyService.spectate(lobbyPageId);

  vm.lobbyInformation = false;

  function updateLobby(lobbyData) {
    safeApply($scope, function () {
      if (lobbyData.state === 1 && angular.isDefined(vm.readyUpInterval)) {
        $interval.cancel(vm.readyUpInterval);
        vm.readyUpInterval = null;
      }

      if (lobbyData.state !== 2) {
        vm.readyUp = false;
      }

      vm.lobbyInformation = lobbyData;
    });
  }

  var lobbyStream = LobbyService.observeLobby(lobbyPageId);
  lobbyStream.onValue(updateLobby);
  $scope.$on('$destroy', () => lobbyStream.offValue(updateLobby));

  vm.lobbyJoinInformation = LobbyService.getLobbyJoinInformation();
  vm.playerPreReady = LobbyService.getPlayerPreReady();
  vm.preReadyUpTimer = LobbyService.getPreReadyUpTimer();

  vm.readyUp = false;
  vm.readyUpTime = 0;
  vm.readyUpPercent = 0;
  vm.readyUpInterval = false;

  LobbyService.subscribe('lobby-start', $scope, () => {
    vm.lobbyJoinInformation = LobbyService.getLobbyJoinInformation();
    vm.readyUp = false;
  });

  LobbyService.subscribe('lobby-ready-up', $scope, function (e, data) {
    var startTime = data.startTime;
    var readyUpMs = data.timeout * 1000;

    vm.readyUp = true;
    vm.readyUpTime = startTime;
    vm.readyUpPercent = 0;
    vm.readyUpInterval = $interval(
      function () {
        var d = (Date.now() - vm.readyUpTime);
        vm.readyUpPercent = 100 * (d / readyUpMs);
        vm.readyUpPercent = Math.min(vm.readyUpPercent, 100);

        if (vm.readyUpPercent === 100) {
          $interval.cancel(vm.readyUpInterval);
          vm.readyUpInterval = null;
        }
      },
      100
    );
  });

  LobbyService.subscribe('lobby-shuffled', $scope, function (e, {id}) {
    var joined = LobbyService.getLobbyJoined();
    if (joined && joined.id === id) {
      LobbyService.setPlayerPreReady(false);
    }
  });

  $scope.$watch(LobbyService.getPlayerPreReady, function () {
    vm.playerPreReady = LobbyService.getPlayerPreReady();
  });

  $scope.$watch(LobbyService.getPreReadyUpTimer, function () {
    vm.preReadyUpTimer = LobbyService.getPreReadyUpTimer();
  });

  $scope.$on('$destroy', function () {
    var joined = LobbyService.getLobbyJoined();
    if (joined && joined.id !== lobbyPageId) {
      LobbyService.leaveSpectatedLobby();
    }
  });

  vm.slotClicked = function (slotScope, event) {
    if (slotScope.slot.password) {
      slotScope.showPasswordBox = true;
      // Wrapped in a timeout because of ng-if DOM manipulation
      $timeout(() => {
        var input = event.target.getElementsByClassName('slot-password-input')[0];
        if (input) {
          input.focus();
        }
      }, 5);
      return;
    }

    vm.join(slotScope);
  };

  vm.onPasswordInputBlur = function (slotScope) {
    slotScope.slotPassword = undefined;
    slotScope.showPasswordBox = false;
  };

  vm.onPasswordInputKeydown = function (slotScope, event) {
    if (event.keyCode !== 13) { // not Enter
      return;
    }

    event.preventDefault();
    vm.join(slotScope);
    vm.onPasswordInputBlur(slotScope);
  };

  vm.join = function (slotScope) {
    LobbyService.join(vm.lobbyInformation.id,
                      slotScope.team,
                      slotScope.class.class,
                      slotScope.slotPassword);
  };

  vm.goToSteamProfile = function (steamId) {
    $window.open('https://steamcommunity.com/profiles/' + steamId, '_blank');
  };

  vm.kick = function (playerSummary) {
    LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid);
  };

  vm.ban = function (playerSummary) {
    LobbyService.ban(vm.lobbyInformation.id, playerSummary.steamid);
  };

  vm.leaveSlot = function () {
    LobbyService.leaveSlot(vm.lobbyInformation.id);
  };

  vm.shuffleTeams = () => LobbyService.shuffleTeams(vm.lobbyInformation.id);

  vm.delayedLaunch = function delayedLaunch(url, delay) {
    if (angular.isUndefined(delay)) {
      delay = 1000;
    }

    $timeout(() => $window.open(url, '_self'), delay);
  };

  vm.preReadyUp = function () {
    LobbyService.setPlayerPreReady(!LobbyService.getPlayerPreReady());
  };

  vm.shouldShowLobbyInformation = function () {
    return vm.lobbyInformation &&
      vm.lobbyInformation.id &&
      vm.lobbyInformation.id === parseInt($state.params.lobbyID);
  };

  vm.promote = function (player) {
    var confirmBox = $mdDialog.confirm()
          .title('Are you sure?')
          .textContent(
            'Are you sure you want to make ' +
              player.name +
              ' the lobby leader?'
          )
          .ok('Change Lobby Leader')
          .cancel('Cancel');

    $mdDialog
      .show(confirmBox)
      .then(function () {
        LobbyService.setLobbyLeader(vm.lobbyInformation.id, player.steamid);
      });
  };

  vm.showRequirementInput = false;
  vm.requirementInputPromise = null;

  vm.setRequirements = function (slot, reqName, val) {
    // If a value is supplied, directly set it. Else prompt the user
    // to enter a value.
    if (angular.isDefined(val)) {
      setReq(val);
    } else {
      vm.inputType = typeof vm.slotRequirementValue === 'string' ? 'text' : 'number';
      if (reqName === 'password') {
        vm.inputType = 'password';
      }

      vm.showRequirementInput = slot.slot;
      vm.requirementInputName = reqName;

      var deferred = $q.defer();
      vm.requirementInputDeferred = deferred;

      deferred.promise.then(function (value) {
        vm.showRequirementInput = false;
        setReq(value);
      }, function () {
        vm.showRequirementInput = false;
      });
    }

    function setReq(value) {
      LobbyService.setSlotRequirement(vm.lobbyInformation.id,
                                      slot.slot,
                                      reqName,
                                      value < 0 ? 0 : value);
    }
  };

  vm.clearTwitchRestriction = () =>
    LobbyService.clearTwitchRestriction(vm.lobbyInformation.id);

  vm.clearSteamRestriction = () =>
    LobbyService.clearSteamRestriction(vm.lobbyInformation.id);

  vm.keydownRequirementInput = function (val, e) {
    if (e.keyCode !== 13) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
    vm.requirementInputDeferred.resolve(val);
  };

  vm.launchTF2 = () => {
    LobbyService.setJoinedId(vm.lobbyInformation.id);
    vm.delayedLaunch(vm.lobbyJoinInformation.connectUrl, 500);
  };
}
