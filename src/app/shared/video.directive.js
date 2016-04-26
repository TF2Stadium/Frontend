import Kefir from 'kefir';

angular.module('tf2stadium.directives')
  .directive('videobg', VideoBackgroundDirective);

/** @ngInject */
function VideoBackgroundDirective($rootScope, Settings) {
  var focused = Kefir.merge([
    Kefir.fromEvents(window, 'focus').map(function () { return true; }),
    Kefir.fromEvents(window, 'blur').map(function () { return false; }),
  ]);

  return {
    restrict: 'E',
    scope: {},
    template:
    '<video ng-if="showVideo && pageFocused" ng-show="videoReady" ng-canplay="canPlay()" autoplay autostart loop class="cinemagraph">' +
      '<source src="/assets/video/koth_suijin.vp9.webm" type=\'video/webm;codecs="vp9"\' />'+
      '<source src="/assets/video/koth_suijin.vp8.webm" type=\'video/webm;codecs="vp8"\' />' +
      '<source src="/assets/video/koth_suijin.h264.mp4" type="video/mp4" />' +
      '</video>',

    link: function (scope) {
      scope.showVideo = false;
      scope.pageFocused = true;

      focused.onValue((isFocused) => {
        scope.$apply(() => {
          if (!scope.pageFocused && isFocused) {
            scope.videoReady = false;
          }

          scope.pageFocused = isFocused;
        });
      });

      // use ng-show to prevent a black flash from displaying
      // an unloaded video when the videoBackground setting changes
      scope.videoReady = false;
      scope.canPlay = () => scope.videoReady = true;

      function syncSettings() {
        Settings.getSettings((settings) => {
          scope.showVideo = (settings.videoBackground === 'on');
          if (!scope.showVideo) {
            scope.videoReady = false;
          }
        });
      }

      var handler = $rootScope.$on('settings-updated', syncSettings);
      scope.$on('$destroy', handler);
    },
  };
}
