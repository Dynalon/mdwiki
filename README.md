[![Build Status](https://travis-ci.org/Dynalon/mdwiki.png?branch=master)](https://travis-ci.org/Dynalon/mdwiki)


MDwiki
======

100% static single file CMS/Wiki done purely with client-side Javascript and HTML5.

See http://www.mdwiki.info for more info and documentation.
------


Download
--------

See <https://github.com/Dynalon/mdwiki/releases> for readily precompiled releases.

How to build from source
------------------------
(applies to master branch, stable may differ)

1. Install node.js >= 0.8 and npm (if not included)
2. Clone the mdwikirepo
3. Install deps:


    npm install

    # install required components
    ./node_modules/.bin/bower install

    # install typescript definitions
    ./node_modules/.bin/tsd reinstall

4. Build MDwiki

    ./node_modules/.bin/grunt release

6. Find the `mdwiki.html` in the `dist/` folder

7. Development

For development, use

    grunt devel 

To get unminified source code compiled to `dist/mdwiki-debug.html`, as well as auto file watching and livereload support. Symlink the development mdwiki file into your webroot for testing.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Dynalon/mdwiki/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

