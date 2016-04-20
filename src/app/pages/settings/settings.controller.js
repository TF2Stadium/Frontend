import * as audio from '../../audio';

angular
  .module('tf2stadium.controllers')
  .controller('SettingsPageController', SettingsPageController);

/** @ngInject */
function SettingsPageController($rootScope, $scope, $mdEditDialog,
                                $timeout,
                                SettingsPage, Settings,
                                User, Notifications, safeApply) {
  var vm = this;

  vm.sections = SettingsPage.getSections();

  vm.saveSetting = function (key, value, showNotification) {
    function updateSettings() {
      var msg = 'Setting updated.';
      var promise = Settings.set(key, value);

      if (showNotification) {
        promise.then(function () {
          Notifications.toast({message: msg});
        }, function () {
          Notifications.toast({message: msg, error: true});
        });
      }
    }

    if (key === 'animationLength') {
      $rootScope.animationLength = 'none';
      setTimeout(() => {
        safeApply($rootScope, updateSettings);
      }, 1);
    } else {
      updateSettings();
    }
  };

  vm.setCurrent = function (key) {
    vm.current = key;
  };

  vm.playSoundSample = function () {
    Settings.getSettings(function (settings) {
      audio.play(Notifications.getSound('preview', settings), settings.soundVolume / 100);
    });
  };

  vm.fetchMumblePassword = function () {
    User
      .getMumblePassword()
      .then(function (data) {
        vm.mumblePassword = data.password;
      });
  };

  vm.resetMumblePassword = function () {
    User.resetMumblePassword();
  };

  vm.enableTwitchBot = function () {
    User.enableTwitchBot();
  };

  vm.disableTwitchBot = function () {
    User.disableTwitchBot();
  };

  /*
   Iterates through all the settings in the list and compares
   them to the stored settings.

   If a user setting exists for that element, it gets updated.
   If it doesn't, it defaults to true.
   */
  var populateFilters = function (userSettings) {
    for (var settingsGroupKey in vm.sections.filters) {
      var settingsGroup = vm.sections.filters[settingsGroupKey];
      for (var fieldKey in settingsGroup) {
        settingsGroup[fieldKey].selected = userSettings[fieldKey];
      }
    }
  };

  vm.selectedServerNames = [];
  vm.savedServers = [];
  vm.serverTableOrder = 'name';

  function saveServers(newSavedServers) {
    Settings.set('savedServers', serializeServers(newSavedServers));
  }

  vm.deleteSelectedServers = function () {
    saveServers(vm.savedServers.filter(function (o) {
      return vm.selectedServerNames.indexOf(o.name) === -1;
    }));
    vm.selectedServerNames = [];
  };

  vm.editServerField = function editServerField(e, server, field) {
    e.stopPropagation(); // prevent auto row-select

    var validators = { 'md-maxlength': field === 'name'? 50 : 100 };

    $mdEditDialog.small({
      modelValue: server[field],
      placeholder: 'Edit ' + field,
      targetEvent: e,
      validators: validators,
      save: function (input) {
        var newValue = input.$modelValue;

        // We do all of this mapping instead of just `server[field]
        // = newValue;` (the server arg is a reference to that
        // element in the savedServers array) because we aren't
        // doing speculative updates, and we want the same behavior
        // for both edits and deletes.
        saveServers(vm.savedServers.map(function (s) {
          if (s.name === server.name) {
            var newProps = {};
            newProps[field] = newValue;
            return angular.extend({}, server, newProps);
          } else {
            return s;
          }
        }));
      },
    }).then(function (ctrl) {
      if (field === 'name') {
        var input = ctrl.getInput();
        input.$viewChangeListeners.push(function () {
          var val = input.$modelValue;
          var nameTaken = server[field] !== val && vm.serverNameAlreadyExists(val);
          input.$setValidity('nameTaken', !nameTaken);
        });
      }
    });
  };

  vm.serverNameAlreadyExists = function (v) {
    return vm.savedServers.filter(function (s) {
      return s.name === v;
    }).length > 0;
  };

  vm.newServerName = '';
  vm.newServerAddress = '';
  vm.saveNewServer = function saveNewServer() {
    saveServers(vm.savedServers.concat({
      name: vm.newServerName,
      url: vm.newServerAddress,
    }));

    $timeout(function () {
      vm.newServerName = '';
      vm.newServerAddress = '';

      vm.newServerForm.$setPristine();
      vm.newServerForm.$setUntouched();
    }, 1);
  };

  function deserializeServers(str) {
    var serversObj = angular.fromJson(str);
    return Object.keys(serversObj).map(function (name) {
      var server = serversObj[name];
      return {
        name: name,
        url: server.url,
        // password: server.password
      };
    });
  }

  function serializeServers(servers) {
    return angular.toJson(
      servers.reduce(function (acc, server) {
        acc[server.name] = { url: server.url };
        return acc;
      }, {})
    );
  }

  function syncSettings() {
    Settings.getSettings(function (settings) {
      vm.originalSettings = settings;

      populateFilters(settings);
      vm.animationLength = settings.animationLength;
      vm.videoBackground = settings.videoBackground;
      vm.soundVolume = +settings.soundVolume;
      vm.siteAlias = settings.siteAlias;
      vm.soundPack = settings.soundPack;

      vm.savedServers = deserializeServers(settings.savedServers);

      vm.emoteStyle = settings.emoteStyle;
    });
  }

  vm.availableSoundPacks = Notifications.availableSoundPacks;
  syncSettings();
  var handler = $rootScope.$on('settings-updated', syncSettings);
  $scope.$on('$destroy', handler);
}
