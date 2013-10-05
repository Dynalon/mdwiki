Download
========

Precompiled releases
--------------------


MDwiki ships with two different files:

  * `mdwiki.html`, 320kB minified (100kB gz compressed). Contains all required scripts and styles inlined, works offline
  * `mdwiki-slim.html`, 80kB minified (32kB gz compressed). Contains only minimal set off styles and scripts, other resources are loaded from a CDN during runtime (jQuery, Bootstrap, Themes, etc.). Does __not__ work offline.

### Get the latest release &raquo;[here][release_dl]&laquo;


  [release_dl]: https://github.com/Dynalon/mdwiki/releases

* * *

Source code
-----------

To download and build from source, `node.js` >= 0.8 is required with installed npm.


```bash
git clone https://github.com/Dynalon/mdwiki.git
cd mdwiki

# will install all dependencies
npm install

# create a release:
./node_modules/.bin/grunt release

# or a debugging friendly mdwiki-devel.html in dist/ with
# automatic filesystem watcher
./node_modules/.bin/grunt devel

```
