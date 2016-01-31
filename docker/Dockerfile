FROM phusion/baseimage:0.9.18

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Add resources
ADD source/nginx.sh /etc/service/nginx/run
ADD source/dist/ /var/www/html

# Build process
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold" && \
    apt-get install git nginx -y && \
    chmod +x /etc/service/nginx/run && \
    sed -i 's|root /usr/share/nginx/html|root /var/www/html|' /etc/nginx/sites-available/default && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 80
