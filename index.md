About
=====

MDwiki is a CMS/Wiki __completely built in HTML5/Javascript and runs 100% on the client__. No special software installation or server side processing is required. Just upload the `mdwiki.html` shipped with MDwiki into the same directory as your markdown files and you are good to go!

Note: The website you are currently viewing is realized with MDwiki and hosted on [GitHub pages](http://pages.github.com/). [http://mdwiki.info](http://mdwiki.info) redirects here.

[gimmick:twitterfollow](timodoerr)

Features
--------

  * Built completely in Javascript/HTML5 and __does not require any local or remote installations__
  * Uses [Markdown][markdown] as its input markup language
  * Build on top of [jQuery][jQuery] and [Bootstrap3][bootstrap] to work cross-browser, with responsive layout
  * Extends Markdown with special [_Gimmicks_][gimmicks] that add rich client functions, like syntax highlighting via [hightlight.js][highlightjs], [GitHub Gists][gists], or [Google Maps][maps] for geo data
  * Themeable through Bootstrap compatibility, supports all themes from [bootswatch](http://www.bootswatch.com)


Requirements
------------

* Webspace (or a web server that can serve static files)
* Any modern Webbrowser
* [mdwiki.html][download] file

How does it work?
-----------------

Just drop the `mdwiki.html` available from [the download page][download] along with your markdown files on a webspace somewhere. You can pass any url (relative to the `mdwiki.html` file) to mdwiki after the hashbang `#!`:

    http://www.example.com/mdwiki.html#!myfile.md

If you rename the `mdwiki.html` into `index.html`, you can omit the filename on most webservers:

    http://www.example.com/#!myfile.md

MDwiki will load a file called `index.md` from the same directory as the index.html by default, so if you use an `index.md` file as entry point, all you have to do is enter your domain name:

    http://example.com/

Note: There are lots more features over regular Markdown, check out the [quickstart tutorial][quickstart].

- - - -

Credits / Technologies
----------------------

MDwiki would not exist if it weren't for those great pieces of software:

  * [marked][marked]
  * [jQuery][jQuery]
  * [Bootstrap][bootstrap]
  * [Bootswatch][bootswatch]
  * [colorbox][colorbox]
  * [highlightjs][highlightjs]

MDwiki is created by Timo Dörr. Follow me to get updates on MDwiki! [Follow @timodoerr](http://www.twitter.com/timodoerr).

Cute kitten images provided by the great [placekitten.com] service.

  [download]: download.md
  [quickstart]: quickstart.md
  [gimmicks]: gimmicks.md

  [markdown]: http://daringfireball.net/projects/markdown/
  [jQuery]: http://www.jquery.org
  [bootstrap]: http://www.getbootstrap.com
  [bootswatch]: http://www.bootswatch.com
  [marked]: https://github.com/chjj/marked
  [colorbox]: http://www.jacklmoore.com/colorbox/
  [gists]: https://gist.github.com/
  [maps]: http://maps.google.com/
  [highlightjs]: https://highlightjs.org/
  [placekitten.com]: http://www.placekitten.com/

License
-------

MDwiki is licensed under [GNU GPLv3 with additional terms applied][license].

  [license]: https://github.com/Dynalon/mdwiki/blob/master/LICENSE.txt
