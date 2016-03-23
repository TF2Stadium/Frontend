require('./scrollglue');

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

import config from './app.config';
import { allowMumbleHref, safeApply } from './util';
import { routeConfig } from './app.route';

angular
  .module('tf2stadium', [
    'tf2stadium.directives',
    'tf2stadium.controllers',
    'tf2stadium.services',
    'tf2stadium.filters',
    'ngAnimate',
    'ui.router',
    'ui.validate',
    'ngMaterial',
    'md.data.table',
    'luegg.directives',
    'ngMedia'
  ])
  .constant('Config', config)
  .factory('safeApply', safeApply)
  .config(routeConfig)
  .config(allowMumbleHref);

angular.module('tf2stadium.controllers', []);

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

angular.module('tf2stadium.filters', []);

angular.module('tf2stadium.services', []);
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
