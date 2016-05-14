import Raven from 'raven-js';
import RavenAngularPlugin from 'raven-js/plugins/angular';

var modules = [];

if (typeof __SENTRY_DSN__ !== 'undefined') {
  Raven
    .config(__SENTRY_DSN__)
    .addPlugin(RavenAngularPlugin)
    .install();
  modules.push('ngRaven');
}

// Only technically needed for tests, normally the global 'angular'
// object is created by default and this require statement triggers a
// 'loading angular twice' warning.
if (window && !window.angular) {
  require('angular');
}

import moment from 'moment';

if (typeof __BUILD_STATS__ !== 'undefined') {
  console.log(
    'Built on ' + __BUILD_STATS__.host +
      ' at ' + moment(__BUILD_STATS__.time).format('LLLL ZZ') +
      ' from hash ' + __BUILD_STATS__.gitCommit.hash +
      ' on branch ' + __BUILD_STATS__.gitCommit.branch
  );
}

import '../scss/app.scss';

/** @ngInject */
function disableDebug($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}

import { allowMumbleHref, safeApply } from './util';
import { routeConfig } from './app.route';

angular.module('tf2stadium', [
  'tf2stadium.directives',
  'tf2stadium.controllers',
  'tf2stadium.services',
  'tf2stadium.filters',
  'ngAnimate',
  require('ngreact').name,
  'ui.router',
  'ui.validate',
  'ngMaterial',
  'md.data.table',
  require('./scrollglue').name,
  'pasvaz.bindonce',
  'ngMedia',
].concat(modules))
  .config(disableDebug)
  .factory('safeApply', safeApply)
  .config(routeConfig)
  .config(allowMumbleHref);

// app-config is a webpack resolve.alias pointing to the preferred
// configuration file.
//
// Old-style config files (which we still support), when require()'d,
// will register themselves as tf2stadium.constant('Config', ...), but
// new style configs just return a value. This supports both, because
// module.constant(...) is actually constant (aka, won't be
// overwritten by a second .constant call).
angular.module('tf2stadium')
  .constant('Config', require('app-config'));

angular.module('tf2stadium.controllers', []);
angular.module('tf2stadium.filters', []);
angular.module('tf2stadium.services', []);

require('./shared/comment-box/comment-box.controller');
require('./shared/notifications/ready-up.controller');
require('./shared/notifications/toast.controller');
require('./shared/lobby-create-button.controller');
require('./shared/current-lobby.controller');
require('./pages/settings/settings.controller');
require('./pages/lobby/page/header.controller');
require('./pages/lobby/page/spectators.controller');
require('./pages/lobby/page/lobby-page.controller');
require('./pages/lobby/create/header.controller');
require('./pages/lobby/create/lobby-create.controller');
require('./pages/lobby/create/wizard-steps.controller');
require('./pages/lobby/list/lobby-list.controller');
require('./pages/lobby/list/sub-list.controller');
require('./pages/user-profile/user-profile.controller');
require('./pages/about/about.controller');

require('./app.notifications');
require('./shared/websocket.factory');
require('./shared/user.factory');
require('./shared/comment-box/chat.service');
require('./pages/lobby/lobby.factory');
require('./pages/lobby/create/lobby-create.provider');
require('./pages/lobby/create/lobby-create.filter');

import { WhitelistDirective, AutofocusDirective } from './app.directive';

angular
  .module('tf2stadium.directives', ['tf2stadium.filters'])
  .directive('whitelist', WhitelistDirective)
  .directive('autofocus', AutofocusDirective);

require('./shared/video.directive');
require('./app.filter');
require('./pages/lobby/list/lobby-list.filter');

require('./app.icons');
require('./pages/settings/settings.provider');
require('./pages/lobby/list/header.controller');
require('./pages/rules/rules.controller');
require('./pages/rules/rules.provider');
require('./pages/about/about.provider');
require('./app.preloading');
require('./app.theme');
require('./app.settings');

require('./app.run');
