/* @flow */
/** @ngInject */
export function safeApply($rootScope: AngularJSScope) {
  return function ($scope: AngularJSScope, fn: () => any) {
    /* eslint-disable angular/no-private-call */
    // I know that using $$phase like this is nasty and can lead to
    // bad code in general, but it significantly simplifies
    // integration with Kefir because we no longer have to know if
    // an observable was updated during an angular digest cycle or
    // not
    var phase = $rootScope.$$phase;

    if (phase === '$apply' || phase === '$digest') {
      if (fn) {
        $scope.$eval(fn);
      }
    } else {
      if (fn) {
        $scope.$apply(fn);
      } else {
        $scope.$apply();
      }
    }
  };
}

/** @ngInject */
export function allowMumbleHref($compileProvider: AngularJSCompileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|steam|mumble):/);
}

/** @ngInject */
export function disableDebug($compileProvider: AngularJSCompileProvider) {
  $compileProvider.debugInfoEnabled(false);
}
