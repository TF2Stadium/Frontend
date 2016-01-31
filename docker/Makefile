docker:
	cd .. && npm install && bower install
	mv ../src/app/app.config.js ../src/app/app.config.js.tmp
	mv ../src/app/app.config.js.template ../src/app/app.config.js
	cd .. && gulp build --prod
	cp -r ../dist source/dist
	docker build -t tf2stadium/frontend .
	mv ../src/app/app.config.js ../src/app/app.config.js.template
	mv ../src/app/app.config.js.tmp ../src/app/app.config.js
	rm -rf source/dist
