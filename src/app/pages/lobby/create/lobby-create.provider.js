(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.config(LobbyCreateConfig)
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
    LobbyCreateProvider.wizardSteps = ['format', 'map', 'league', 'whitelist', 'mumble'];

    for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
      var stepName = LobbyCreateProvider.wizardSteps[i];
      $stateProvider.state('lobby-create.' + stepName, {
        url: '/' + stepName,
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
    var lobbyCreateService = function(Websocket) {

      var lobbySettingsList = {
        formats: {
          key: 'type',
          options: [
            {
              key: 'sixes',
              name: '6v6',
              important: true
            },{
              key: 'highlander',
              name: 'Highlander',
              important: true
            },{
              key: '4v4',
              name: '4v4'
            },{
              key: 'ultiduo',
              name: 'Ultiduo'
            },{
              key: 'arena-respawn',
              name: 'Arena:Respawn'
            },{
              key: 'bball',
              name: 'Bball'
            }
          ]
        },
        maps: {
          key: 'map',
          options: [
            {
              name: 'cp_badlands',
              sixes: true
            },{
              name: 'cp_granary',
              sixes: true
            },{
              name: 'cp_process_final',
              important: true,
              sixes: true
            },{
              name: 'cp_snakewater',
              sixes: true
            },{
              name: 'cp_gullywash',
              sixes: true,
              highlander: true
            },{
              name: 'cp_metalworks',
              sixes: true
            },{
              name: 'cp_sunshine',
              sixes: true,
              highlander: true
            },{
              name: 'koth_viaduct_pro',
              sixes: true,
              highlander: true
            },{
              name: 'pl_upward',
              highlander: true
            },{
              name: 'pl_badwater',
              highlander: true
            },{
              name: 'pl_borneo',
              highlander: true
            },{
              name: 'pl_swiftwater',
              highlander: true
            },{
              name: 'pl_barnblitz_pro',
              highlander: true
            },{
              name: 'cp_steel',
              highlander: true
            },{
              name: 'koth_lakeside',
              highlander: true
            },{
              name: 'koth_ramjam',
              highlander: true
            }
          ]
        },
        leagues: {
          key: 'league',
          options: {
            etf2l: {
              name: 'ETF2L',
              sixes: true,
              highlander: true
            },
            ugc: {
              name: 'UGC',
              sixes: true,
              highlander: true
            },
            esea: {
              name: 'ESEA',
              sixes: true
            },
            ozfortress: {
              name: 'ozfortress',
              sixes: true
            },
            asia: {
              name: 'AsiaFortress',
              sixes: true
            }
          }
        },
        whitelists: {
          key: 'whitelist',
          options: {
            '3250': {
              name: 'ETF2L Highlander (Season 8)',
              league: 'etf2l',
              format: 'highlander'
            },
            '3951': {
              name: 'UGC Highlander (Season 16)',
              league: 'ugc',
              format: 'highlander'
            },
            '3771': {
              name: 'UGC Highlander (Season 16)',
              league: 'ugc',
              format: '4v4'
            },
            '3688': {
              name: 'ESEA 6v6 (Season 19)',
              league: 'esea',
              format: 'sixes'
            },
            '4034': {
              name: 'ozfortress 6v6 (OWL 14)',
              league: 'ozfortress',
              format: 'sixes'
            },
            '3872': {
              name: 'AsiaFortress 6v6 (Season 9)',
              league: 'asia',
              format: 'sixes'
            }            
          }
        }
      }

      lobbyCreateService.create = function(lobbySettings) {
        console.log(lobbySettings)
        Websocket.emit('lobbyCreate',
          JSON.stringify(lobbySettings),
          function(data) {
            var response = JSON.parse(data);
            console.log(response);
          }
        );
      }

      lobbyCreateService.getSettingsList = function() {
        return lobbySettingsList;
      }

      lobbyCreateService.getSteps = function() {
        return lobbyCreateProvider.wizardSteps;
      }

      return lobbyCreateService;
    }

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
  }

})();