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

require('./shared/comment-box/comment-box.html');
require('./shared/notifications/ready-up.html');
require('./shared/notifications/toast.html');
require('./pages/settings/section-filters.html');
require('./pages/settings/section-chat.html');
require('./pages/settings/section-servers.html');
require('./pages/settings/settings.html');
require('./pages/settings/section-sound.html');
require('./pages/settings/section-general.html');
require('./pages/settings/settings-sidebar.html');
require('./pages/settings/section-theme.html');
require('./pages/settings/section-account.html');
require('./pages/lobby/page/spectators.html');
require('./pages/lobby/page/header.html');
require('./pages/lobby/page/lobby-page.html');
require('./pages/lobby/create/step-restrictions.html');
require('./pages/lobby/create/step-server.html');
require('./pages/lobby/create/step-mumble.html');
require('./pages/lobby/create/header.html');
require('./pages/lobby/create/lobby-create-steps.html');
require('./pages/lobby/create/step-map.html');
require('./pages/lobby/create/lobby-create.html');
require('./pages/lobby/create/step-whitelist.html');
require('./pages/lobby/create/step-format.html');
require('./pages/lobby/create/step-league.html');
require('./pages/lobby/list/header.html');
require('./pages/lobby/list/lobby-list.html');
require('./pages/rules/rules-sidebar.html');
require('./pages/rules/rules.html');
require('./pages/rules/section-punishments.html');
require('./pages/rules/section-rules.html');
require('./pages/user-profile/user-profile.html');
require('./pages/about/about-sidebar.html');
require('./pages/about/section-about.html');
require('./pages/about/section-privacy.html');
require('./pages/about/section-servers.html');
require('./pages/about/about.html');
require('./pages/about/section-credits.html');
require('./pages/about/section-faq.html');

require('../scss/app.scss');

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
  'ngMedia'
])
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
