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
      'server',
      'confirm'
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
    var lobbyCreateService = function(Websocket, $state) {

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
              value: '4v4',
              title: '4v4'
            },{
              value: 'ultiduo',
              title: 'Ultiduo'
            },{
              value: 'arena-respawn',
              title: 'Arena:Respawn'
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
          key: 'mapName',
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
              sixes: true
            },{
              value: 'cp_gullywash_final1',
              sixes: true,
              highlander: true
            },{
              value: 'cp_metalworks_rc5',
              sixes: true
            },{
              value: 'cp_sunshine_rc7',
              sixes: true,
              highlander: true
            },{
              value: 'koth_pro_viaduct_rc4',
              sixes: true,
              highlander: true,
              important: true
            },{
              value: 'pl_upward',
              highlander: true
            },{
              value: 'pl_badwater',
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
              description: 'Brief description of the ETF2L rules.',
              sixes: true,
              highlander: true
            },{
              value: 'ugc',
              title: 'UGC',
              description: 'Brief description of the UGC rules.',
              sixes: true,
              highlander: true
            },{
              value: 'esea',
              title: 'ESEA',
              description: 'Brief description of the ESEA rules.',
              sixes: true
            },{
              value: 'ozfortress',
              title: 'ozfortress',
              description: 'Brief description of the ozfortress rules.',
              sixes: true
            },{
              value: 'asia',
              title: 'AsiaFortress',
              description: 'Brief description of the AsiaFortress rules.',
              sixes: true
            }
          ]
        },
        whitelists: {
          key: 'whitelist',
          title: 'Whitelist',
          options: [
            {
              value: 3250,
              title: 'ETF2L Highlander (Season 8)',
              league: 'etf2l',
              format: 'highlander'
            },{
              value: 3951,
              title: 'UGC Highlander (Season 16)',
              league: 'ugc',
              format: 'highlander'
            },{
              value: 3771,
              title: 'UGC Highlander (Season 16)',
              league: 'ugc',
              format: '4v4'
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

      lobbyCreateService.verifyServer = function(address, password, callback) {
        callback = callback || angular.noop;

        Websocket.emitJSON('serverVerify',
          {server: address, rconpwd: password},
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

      return lobbyCreateService;
    };

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
  }

})();