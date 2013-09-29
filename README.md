MDwiki
======

100% static file, client-side CMS/wiki done in Javascript. See http://dynalon.github.io/mdwiki for more info and documentation.

How to build
------------

1. Install node.js >= 0.8 and npm (if not included)
2. Clone this repo
3. Install deps:

    npm install

4. Install components

    bower install

    (or if not installed globally)
    ./node_modules/.bin/bower install

5. Build MDwiki

    grunt release

    (or if not installed globally)
    ./node_modules/.bin/grunt release

6. Find the `mdwiki.html` in the `release/` and `dist/` folder

