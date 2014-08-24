all:
	npm install
	./node_modules/.bin/bower install
	./node_modules/.bin/tsd reinstall --save
	./node_modules/.bin/grunt debug release 
