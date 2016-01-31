#!/bin/bash
sed -i 's|<<WS_ENDPOINT>>|'${WS_ENDPOINT}'|g' /var/www/html/scripts/*.js;
sed -i 's|<<API_ENDPOINT>>|'${API_ENDPOINT}'|g' /var/www/html/scripts/*.js;
exec /usr/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
