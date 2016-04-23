# Servers

Servers used for lobbies do not necessarily require any plugins
(except for bball.tf requiring SourceMod), but the following plugins
will help provide a much better experience for everyone playing on
your server:

## Server Mods

* [TFTrue](http://tftrue.esport-tools.net/): When present, we use this
  server plugin in order to automatically configure the server's
  whitelist using [whitelist.tf](http://whitelist.tf).
* [SourceMod](https://wiki.alliedmods.net/Installing_SourceMod_(simple)):
  Allows for other addons, and is need for the bball.tf config (which
  uses sm_cvar to set spec_freeze_time 0).
* [SM Teams Plugin](https://github.com/TF2Stadium/stadium-sm-plugin/raw/master/teams.smx):
  When present, we use this SourceMod plugin in order to automatically
  assign people to their properp team and class, and to sync their
  in-game name with their TF2Stadium alias.

## serveme.tf

Servers from [serveme.tf](http://serveme.tf/) may be used, but note
that the lobby will be automatically closed if the reservation
ends. This can happen if the reservation ends before the current lobby
is finished, or if the server is idle for too long (for example, while
waiting for players to join the lobby).
