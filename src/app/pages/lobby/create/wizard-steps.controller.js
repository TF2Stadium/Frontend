/* @flow */
import {isEmpty} from 'lodash';

angular.module('tf2stadium.controllers')
  .controller('WizardStepsController', WizardStepsController);

/** @ngInject */
function WizardStepsController(LobbyCreate, $rootScope, $scope, Settings) {
  var vm = this;
  vm.steps = LobbyCreate.getSteps();

  vm.showSavedConfigurations = false;
  function syncSettings(settings) {
    var savedConfigurations = angular.fromJson(settings.savedConfigurations);
    var recentConfigurations = angular.fromJson(settings.recentConfigurations);
    vm.showSavedConfigurations = !isEmpty(recentConfigurations) ||
      !isEmpty(savedConfigurations);
  }

  Settings.getSettings(syncSettings);
  var handler = $rootScope.$on('settings-updated', () => {
    Settings.getSettings(syncSettings);
  });
  $scope.$on('$destroy', handler);

  var lobbySettingsList = LobbyCreate.getSettingsList();

  var lobbySettings = LobbyCreate.getLobbySettings();
  LobbyCreate.subscribe('lobby-create-settings-updated', $scope, function () {
    lobbySettings = LobbyCreate.getLobbySettings();
  });

  vm.isEnabled = function (step) {
    var previousStepIndex = vm.steps.indexOf(step) - 1;
    var previousStep = vm.steps[previousStepIndex] || vm.steps[0];
    return vm.isAlreadyFilled(previousStep) || vm.isAlreadyFilled(step) || (previousStepIndex === -1);
  };

  vm.isAlreadyFilled = function (step) {
    var settingGroup = lobbySettingsList[step.groupKey]; // e.g. lobbySettingsList.formats
    return settingGroup && lobbySettings.hasOwnProperty(settingGroup.key); // might be a boolean
  };

}
