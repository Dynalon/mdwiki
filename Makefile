all:
	npm install
	./node_modules/.bin/bower install
	./node_modules/.bin/tsd reinstall
	./node_modules/.bin/grunt debug release 
