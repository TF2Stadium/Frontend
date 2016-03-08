FROM phusion/baseimage:0.9.18

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
EXPOSE 80

# Build process
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold" && \
    apt-get install nginx -y && \
    sed -i 's|root /usr/share/nginx/html|root /var/www/html|' /etc/nginx/sites-available/default && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Add NGINX startup script
ADD source/nginx.sh /etc/service/nginx/run
ADD source/nginx.conf /etc/nginx/sites-enabled/default
RUN chmod +x /etc/service/nginx/run

# Add resources
ADD source/dist/ /var/www/html
