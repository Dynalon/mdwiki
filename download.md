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

Latest CI build from git
-----------

[![Travis build status](https://api.travis-ci.org/Dynalon/mdwiki.png)]()
We use the great [Travis Continuous Integration service](http://www.travis-ci.org) to automatically do builds from our git `master` branch. The builds are automatically uploaded to the MDwiki website (that is the `gh-pages` branch of MDwiki at GitHub) a few minutes after a commit is checked in.

Attention: To **download** the latest build, you need to right click -> "Save link as". Else you will only visit the MDwiki website using the latest build!

* [mdwiki-latest.html](mdwiki-latest.html), Minified version for production use
* [mdwiki-latest-debug.html](mdwiki-latest-debug.html), Unminified version for debugging and testing

Source code
-----------

To download and build from source, `node.js` >= 0.10 is required with installed npm.


```bash
git clone https://github.com/Dynalon/mdwiki.git
cd mdwiki

# will fetch deps and build everything (requires automake installed)
make

# now find your local mdwiki.html in the dist/ folder


# for development: Create a debugging friendly, unminified mdwiki-debug.html
# in dist/ with automatic filesystem watcher
./node_modules/.bin/grunt devel

```
