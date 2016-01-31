#!/bin/bash
sed -i 's|localhost:8080|'${API_ENDPOINT}'|g' /var/www/html/scripts/*.js;
exec /usr/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
