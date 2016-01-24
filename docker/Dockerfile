FROM phusion/baseimage:0.9.18

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Update Sources
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

# Install Git & NGINX
RUN apt-get install git nginx -y

# Add NGINX to runit
RUN mkdir /etc/service/nginx
ADD source/nginx.sh /etc/service/nginx/run
RUN chmod +x /etc/service/nginx/run

# Change NGINX Root
RUN sed -i 's|root /usr/share/nginx/html|root /var/www/html|' /etc/nginx/sites-available/default

# Add Frontend to Container
ADD source/dist/ /var/www/html

# Cleanup
USER root
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
