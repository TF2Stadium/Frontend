(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.config(LobbyCreateConfig);
  app.provider('LobbyCreate', LobbyCreate);

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
      'format',
      'map',
      'league',
      'whitelist',
      'mumble',
      'server'
    ];

    for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
      var stepName = LobbyCreateProvider.wizardSteps[i];
      $stateProvider.state(stepName, {
        url: '/' + stepName,
        parent: 'lobby-create',
        views: {
          "wizard-step": {
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
    var lobbyCreateService = function(Websocket, $state, $rootScope) {

      var lobbySettingsList = {
        formats: {
          key: 'type',
          title: 'Format',
          options: [
            {
              value: 'sixes',
              title: '6v6',
              important: true
            },{
              value: 'highlander',
              title: 'Highlander',
              important: true
            },{
              value: 'fours',
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
          options: [
            {
              value: 'cp_badlands',
              sixes: true
            },{
              value: 'cp_granary_pro_b10',
              sixes: true
            },{
              value: 'cp_process_final',
              important: true,
              sixes: true
            },{
              value: 'cp_snakewater_final1',
              sixes: true,
              important: true
            },{
              value: 'cp_gullywash_final1',
              sixes: true,
              highlander: true,
            },{
              value: 'cp_metalworks_rc5',
              sixes: true
            },{
              value: 'cp_sunshine_rc7',
              sixes: true,
              highlander: true
            },{
              value: 'koth_product_rc8',
              sixes: true,
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
              fours: true
            },{
              value: 'koth_highpass_rc1a',
              fours: true
            },{
              value: 'cp_alamo',
              fours: true
            },{
              value: 'koth_sandstone_pro_rc1',
              fours: true
            },{
              value: 'cp_warmfrost_rc1',
              fours: true
            },{
              value: 'koth_artefact_v1',
              fours: true
            },{
              value: 'koth_airfield_b7',
              fours: true
            },{
              value: 'ctf_ballin',
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
          ]
        },
        leagues: {
          key: 'league',
          title: 'League',
          options: [
            {
              value: 'etf2l',
              title: 'ETF2L',
              description: '',
              sixes: true,
              highlander: true,
              bball: true,
              ultiduo: true
            },{
              value: 'ugc',
              title: 'UGC',
              description: '',
              sixes: true,
              highlander: true,
              fours: true
            },{
              value: 'esea',
              title: 'ESEA',
              description: '',
              sixes: true
            },{
              value: 'ozfortress',
              title: 'ozfortress',
              description: '',
              sixes: true
            },{
              value: 'asia',
              title: 'AsiaFortress',
              description: '',
              sixes: true
            },
          ]
        },
        whitelists: {
          key: 'whitelistID',
          title: 'Whitelist',
          options: [
            {
              value: 3250,
              title: 'ETF2L Highlander (Season 8)',
              league: 'etf2l',
              format: 'highlander'
            },{
              value: 4498,
              title: 'ETF2L 6v6 (Season 22)',
              league: 'etf2l',
              format: 'sixes'
            },{
              value: 3951,
              title: 'UGC Highlander (Season 16)',
              league: 'ugc',
              format: 'highlander'
            },{
              value: 4559,
              title: 'UGC 6v6 (Season 19)',
              league: 'ugc',
              format: 'sixes'
            },{
              value: 3771,
              title: 'UGC 4v4 (Season 16)',
              league: 'ugc',
              format: 'fours'
            },{
              value: 3688,
              title: 'ESEA 6v6 (Season 19)',
              league: 'esea',
              format: 'sixes'
            },{
              value: 4034,
              title: 'ozfortress 6v6 (OWL 14)',
              league: 'ozfortress',
              format: 'sixes'
            },{
              value: 3872,
              title: 'AsiaFortress 6v6 (Season 9)',
              league: 'asia',
              format: 'sixes'
            },{
              value: 3312,
              title: 'ETF2L Ultiduo',
              league: 'etf2l',
              format: 'ultiduo'
            },{
              value: 3759,
              title: 'ETF2L BBall',
              league: 'etf2l',
              format: 'bball'
            }
          ]
        },
        mumble: {
          key: 'mumbleRequired',
          title: 'Mumble required',
          options: [
            {
              value: true,
              title: 'Mumble required',
              description: 'All participants will need to join the mumble channel.',
            },{
              value: false,
              title: 'Mumble not required',
              description: 'Participants will join the mumble only if they want to do so.',
            }
          ]
        }
      };

      lobbyCreateService.settings = {};

      lobbyCreateService.subscribe = function(request, scope, callback) {
        var handler = $rootScope.$on(request, callback);
        scope.$on('$destroy', handler);
      };

      lobbyCreateService.create = function(lobbySettings, callback) {
        callback = callback || angular.noop;

        Websocket.emitJSON('lobbyCreate',
          lobbySettings,
          function(response) {
            if (response.success) {
              $state.go('lobby-page', {lobbyID: response.data.id});
            }
            callback(response);
          }
        );
      };

      lobbyCreateService.verifyServer = function(callback) {
        callback = callback || angular.noop;

        Websocket.emitJSON('serverVerify',
          {
            server: lobbyCreateService.settings.server,
            rconpwd: lobbyCreateService.settings.rconpwd
          },
          function(response) {
            callback(response.success);
          }
        );
      };

      lobbyCreateService.getSettingsList = function() {
        return lobbySettingsList;
      };

      lobbyCreateService.getSteps = function() {
        return lobbyCreateProvider.wizardSteps;
      };

      lobbyCreateService.clearLobbySettings = function() {
        lobbyCreateService.settings = {};
        $rootScope.$emit('lobby-create-settings-updated');
      };

      lobbyCreateService.getLobbySettings = function() {
        return lobbyCreateService.settings;
      };

      lobbyCreateService.set = function(key, value) {
        lobbyCreateService.settings[key] = value;
        $rootScope.$emit('lobby-create-settings-updated');
      };

      return lobbyCreateService;
    };

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
  }

})();
