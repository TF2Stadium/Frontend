(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(LobbyCreateConfig)
    .provider('LobbyCreate', LobbyCreate);

  /** @ngInject */
  function LobbyCreateConfig($stateProvider, LobbyCreateProvider) {
    /*
      Since the steps might change over time, it's much easier
      to add the nested states here with a loop instead of
      manually in app.route.js

      It also makes sense to add them in this separate file
      because they're nested states
    */
    LobbyCreateProvider.wizardSteps = [
      {name: 'format',      groupKey: 'formats'},
      {name: 'map',         groupKey: 'maps'},
      {name: 'league',      groupKey: 'leagues'},
      {name: 'whitelist',   groupKey: 'whitelists'},
      {name: 'mumble',      groupKey: 'mumble'},
      {name: 'server',      groupKey: 'server'}
    ];

    for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
      var stepName = LobbyCreateProvider.wizardSteps[i].name;
      $stateProvider.state(stepName, {
        url: '/' + stepName,
        parent: 'lobby-create',
        views: {
          'wizard-step': {
            templateUrl: 'app/pages/lobby/create/step-' + stepName + '.html'
          }
        }
      });
    }
  }

  /** @ngInject */
  function LobbyCreate() {

    var lobbyCreateProvider = {};

    lobbyCreateProvider.wizardSteps = {};

    /** @ngInject */
    var lobbyCreateService = function (Websocket, $state, $rootScope, $filter) {

      var lobbySettingsList = {
        formats: {
          key: 'type',
          title: 'Format',
          filterable: true,
          options: [
            {
              value: '6s',
              title: '6s',
              important: true
            },{
              value: 'highlander',
              title: 'Highlander',
              important: true
            },{
              value: '4v4',
              title: '4v4'
            },{
              value: 'ultiduo',
              title: 'Ultiduo'
            },{
              value: 'bball',
              title: 'Bball'
            },{
              value: 'debug',
              title: 'Debug'
            }
          ]
        },
        maps: {
          key: 'map',
          title: 'Map',
          filterable: true,
          options: [
            {
              value: 'cp_badlands',
              '6s': true
            },{
              value: 'cp_granary_pro_b10',
              '6s': true
            },{
              value: 'cp_process_final',
              important: true,
              '6s': true
            },{
              value: 'cp_snakewater_final1',
              '6s': true,
              important: true
            },{
              value: 'cp_gullywash_final1',
              '6s': true,
              highlander: true
            },{
              value: 'cp_metalworks_rc5',
              '6s': true
            },{
              value: 'cp_sunshine_rc7',
              '6s': true,
              highlander: true
            },{
              value: 'koth_product_rc8',
              '6s': true,
              highlander: true,
              important: true
            },{
              value: 'pl_upward',
              important: true,
              highlander: true
            },{
              value: 'pl_badwater',
              important: true,
              highlander: true
            },{
              value: 'pl_borneo',
              highlander: true
            },{
              value: 'pl_swiftwater_ugc',
              highlander: true
            },{
              value: 'pl_barnblitz_pro6',
              highlander: true
            },{
              value: 'cp_steel',
              highlander: true
            },{
              value: 'koth_lakeside_final',
              highlander: true
            },{
              value: 'koth_ramjam_rc1',
              highlander: true
            },{
              value: 'koth_badlands',
              '4v4': true
            },{
              value: 'koth_highpass_rc1a',
              '4v4': true
            },{
              value: 'cp_alamo',
              '4v4': true
            },{
              value: 'koth_sandstone_pro_rc1',
              '4v4': true
            },{
              value: 'cp_warmfrost_rc1',
              '4v4': true
            },{
              value: 'koth_artefact_v1',
              '4v4': true
            },{
              value: 'koth_airfield_b7',
              '4v4': true
            },{
              value: 'ctf_ballin_sky',
              important: true,
              'bball': true
            },{
              value: 'ctf_bball_alpine_b4',
              important: true,
              'bball': true
            },{
              value: 'ultiduo_baloo',
              important: true,
              'ultiduo': true
            },{
              value: 'koth_ultiduo_r_b7',
              important: true,
              'ultiduo': true
            }
          ],
          dependsOn: [
            'formats'
          ]
        },
        leagues: {
          key: 'league',
          title: 'League',
          filterable: true,
          options: [
            {
              value: 'etf2l',
              title: 'ETF2L',
              description: '',
              '6s': true,
              highlander: true,
              bball: true,
              ultiduo: true
            },{
              value: 'ugc',
              title: 'UGC',
              description: '',
              '6s': true,
              highlander: true,
              '4v4': true
            },{
              value: 'esea',
              title: 'ESEA',
              description: '',
              '6s': true
            },{
              value: 'ozfortress',
              title: 'ozfortress',
              description: '',
              '6s': true
            },{
              value: 'asiafortress',
              title: 'AsiaFortress',
              description: '',
              '6s': true
            }
          ],
          dependsOn: [
            'formats'
          ]
        },
        whitelists: {
          key: 'whitelistID',
          title: 'Whitelist',
          filterable: true,
          options: [
            {
              value: 3250,
              title: 'ETF2L Highlander (Season 8)',
              etf2l: true,
              highlander: true
            },{
              value: 4498,
              title: 'ETF2L 6v6 (Season 22)',
              etf2l: true,
              '6s': true
            },{
              value: 3951,
              title: 'UGC Highlander (Season 16)',
              ugc: true,
              highlander: true
            },{
              value: 4559,
              title: 'UGC 6v6 (Season 19)',
              ugc: true,
              '6s': true
            },{
              value: 3771,
              title: 'UGC 4v4 (Season 16)',
              ugc: true,
              '4v4': true
            },{
              value: 3688,
              title: 'ESEA 6v6 (Season 19)',
              esea: true,
              '6s': true
            },{
              value: 4034,
              title: 'ozfortress 6v6 (OWL 14)',
              ozfortress: true,
              '6s': true
            },{
              value: 3872,
              title: 'AsiaFortress 6v6 (Season 9)',
              asia: true,
              '6s': true
            },{
              value: 3312,
              title: 'ETF2L Ultiduo',
              etf2l: true,
              ultiduo: true
            },{
              value: 3759,
              title: 'ETF2L BBall',
              etf2l: true,
              bball: true
            }
          ],
          dependsOn: [
            'formats',
            'leagues'
          ]
        },
        mumble: {
          key: 'mumbleRequired',
          title: 'Mumble required',
          options: [
            {
              value: true,
              title: 'Mumble required',
              description: 'All participants will need to join the mumble channel.'
            },{
              value: false,
              title: 'Mumble not required',
              description: 'Participants will join the mumble only if they want to do so.'
            }
          ]
        }
      };

      lobbyCreateService.settings = {};

      var deleteSetting = function (key) {
        delete lobbyCreateService.settings[key];
        $rootScope.$emit('lobby-create-settings-updated');
      };

      /*
        Receives a field (e.g. lobbySettingsList.maps) and an option value
        (e.g. 'pl_upward'), finds the option in the field and checks
        if it's valid
      */
      var isSettingValid = function (fieldKey, optionValue) {
        var isValid = false;
        var field = lobbySettingsList[fieldKey];
        field.options.forEach(function (option) {
          if (option.value === optionValue) {
            isValid = $filter('LobbyCreateOptionFilter')([option], fieldKey,'')[0];
          }
        });
        return isValid;
      };

      lobbyCreateService.subscribe = function (request, scope, callback) {
        var handler = $rootScope.$on(request, callback);
        scope.$on('$destroy', handler);
      };

      lobbyCreateService.create = function (lobbySettings, callback) {
        callback = callback || angular.noop;

        Websocket.emitJSON('lobbyCreate',
          lobbySettings,
          function (response) {
            if (response.success) {
              $state.go('lobby-page', {lobbyID: response.data.id});
            }
            callback(response);
          }
        );
      };

      lobbyCreateService.verifyServer = function (callback) {
        callback = callback || angular.noop;

        Websocket.emitJSON('serverVerify',
          {
            server: lobbyCreateService.settings.server,
            rconpwd: lobbyCreateService.settings.rconpwd
          },
          function (response) {
            callback(response);
          }
        );
      };

      lobbyCreateService.getSettingsList = function () {
        return lobbySettingsList;
      };

      lobbyCreateService.getSteps = function () {
        return lobbyCreateProvider.wizardSteps;
      };

      lobbyCreateService.clearLobbySettings = function () {
        lobbyCreateService.settings = {};
        $rootScope.$emit('lobby-create-settings-updated');
      };

      lobbyCreateService.getLobbySettings = function () {
        return lobbyCreateService.settings;
      };

      lobbyCreateService.set = function (key, value) {
        lobbyCreateService.settings[key] = value;
        $rootScope.$emit('lobby-create-settings-updated');

        //If we select something, we need to check if the next steps
        //have already been selected, and if they have, check that they're valid
        var checks = [
          {fieldKey: 'maps', optionName: lobbyCreateService.settings.map},
          {fieldKey: 'leagues', optionName: lobbyCreateService.settings.league},
          {fieldKey: 'whitelists', optionName: lobbyCreateService.settings.whitelistID}
        ];

        checks.forEach(function (check) {
          if (!isSettingValid(check.fieldKey, check.optionName)) {
            var field = lobbySettingsList[check.fieldKey];
            deleteSetting(field.key);
          }
        });
      };

      return lobbyCreateService;
    };

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
  }

})();
