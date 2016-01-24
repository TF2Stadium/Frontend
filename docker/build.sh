#!/usr/bin/env bash
#ToDo: Add Error Handling

set -e

cd ..;
npm install;
bower install;
gulp build --prod;
cp -r dist docker/source/dist;
cd docker;
docker build -t tf2stadium/frontend .;
rm -rf source/dist;
