/* @flow */
angular.module('tf2stadium.controllers')
  .controller('LobbyCreateButtonController', LobbyCreateButtonController);


const requireFormatImage = require.context('../../assets/img/formats/', true, /\.jpg$/);

/** @ngInject */
function LobbyCreateButtonController($q, PreloadService, LobbyCreate) {
  var vm = this;

  vm.preloadLobbyCreate = () => {
    // TODO: we could make this not rely on the lobby format being
    // the first lobby-create step (wiuth
    // LobbyCreate.getSteps()[0]), but we need to know the image URL
    // to preload (which is only defined in the templates...)
    LobbyCreate.getSettingsList()['formats'].options
      .filter(v => v.value !== 'debug')
      .map(opt => requireFormatImage('./' + opt.value + '.jpg'))
      .forEach(PreloadService.queuePreload);
  };
}
