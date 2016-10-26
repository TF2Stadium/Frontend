#!/bin/bash
sed -i 's|<<WS_ENDPOINT>>|'${WS_ENDPOINT}'|g' /var/www/html/*.js;
sed -i 's|<<API_ENDPOINT>>|'${API_ENDPOINT}'|g' /var/www/html/*.js;
sed -i 's|<<SENTRY_ENDPOINT>>|'${SENTRY_ENDPOINT}'|g' /var/www/html/*.js;
sed -i 's|<<DISCORD_LINK>>|'${DISCORD_LINK}'|g' /var/www/html/*.js;
exec /usr/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
