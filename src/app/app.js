/* @flow */
import angular from 'angular';
import config from 'app-config';
import ngreact from 'ngreact';
import scrollglue from './scrollglue';
import { isEmpty } from 'lodash';
import Raven from 'raven-js';
import RavenAngularPlugin from 'raven-js/plugins/angular';
import moment from 'moment';
import routeConfig from './app.route';
import { module as aboutPage } from './pages/about';
import { module as rulesPage } from './pages/rules';
import { allowMumbleHref, safeApply, disableDebug } from './util';
import { WhitelistDirective, AutofocusDirective } from './app.directive';

import buildStats from './build-stats';

import '../scss/app.scss';

var modules = [],
  release = 'development';

if (typeof buildStats !== 'undefined') {
  const { host, time, gitCommit: { hash, branch } } = buildStats,
    timeStr = moment(time).format('LLLL ZZ');

  console.log(
    `Built on ${host} at ${timeStr} from hash ${hash} on branch ${branch}`
  );

  release = hash;
}

if (!isEmpty(config.sentryDSN)) {
  Raven
    .config(config.sentryDSN, { release })
    .addPlugin(RavenAngularPlugin)
    .install();
  modules.push('ngRaven');

  // TODO: Remove once prod setup is verified
  console.log(`Logging to ${config.sentryDSN}`);
}

angular.module('tf2stadium', [
  aboutPage.name,
  rulesPage.name,
  'tf2stadium.directives',
  'tf2stadium.controllers',
  'tf2stadium.services',
  'tf2stadium.filters',
  'ngAnimate',
  ngreact.name,
  'ui.router',
  'ui.validate',
  'ngMaterial',
  'md.data.table',
  scrollglue.name,
  'pasvaz.bindonce',
  'ngMedia',
].concat(modules))
  .config(disableDebug)
  .factory('safeApply', safeApply)
  .config(routeConfig)
  .config(allowMumbleHref)
  .constant('Config', config);

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
require('./pages/tournament/list/tournament-list.controller');
require('./pages/lobby/list/sub-list.controller');
require('./pages/user-profile/user-profile.controller');

require('./app.notifications');
require('./shared/websocket.factory');
require('./shared/user.factory');
require('./shared/comment-box/chat.service');
require('./pages/lobby/lobby.factory');
require('./pages/lobby/create/lobby-create.provider');
require('./pages/lobby/create/lobby-create.filter');

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
require('./app.preloading');
require('./app.theme');
require('./app.settings');

require('./app.run');
