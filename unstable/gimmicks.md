Gimmicks
=========

Gimmicks are little helper that bring plenty of dynamic features into your page. For example, you can use them to inline youtube videos, image slideshows or facebook like buttons.

To use Gimmicks, all you have to do is include some specially crafted link into your markdown file. For example, if you want to embed a Youtube video (instead of linking to it), you just have to insert a link to the video:


    [](http://www.youtube.com/watch?v=RMINSD7MmT4)

Gimmicks are realized via Javascript and work out of the box. Some gimmicks can be called with parameters on them, to customize their behaviour:


    [gimmick:ForkMeOnGitHub ({ color: 'red',  position: 'left' })](http://www.github.com/Dynalon/mdwiki)


The arguments are passed as a Javascript object. But for convienience reasons, you can omit the curly brackets `{ }`. The gimmick name after `gimmick:` is also case-insensitive:

    [gimmick:forkmeongithub(color: 'red', position: 'left')](http://www.github.com/Dynalon/mdwiki)

Gimmicks are designed to always chose sane default values when no parameters are given, therefore *most* gimmicks do not require any parameters to work.

Note: Gimmicks will usually load code or stylesheets from the internet, therefore they won't work in offline mode


Available Gimmicks
===================
* * *

Alerts
------

Alerts are automatically placed whenever you start a paragraph with a special *trigger* word, that *has* to be followed by a colon `:` or exclamation mark `!`.

Trigger words are case insensitive, and must be one of the following:

Type       | Trigger
-----------|---------
Warning    |warning, achtung, attention, warnung, atención, guarda, advertimiento
Note       |note, beachte
Hint       |hint, tip, tipp, hinweis

Preview:

Attention: This text is important.

Note! This is a note.

Hint: This is a hint.

* * *

GitHub Gists
------------

Gists on github can be embedded by passing their numeric id:

    [gimmick:gist](5641564)

Preview:

[gimmick:gist](5641564)

* * *


Facebook Likebutton
-------------------

Take any link of a profile page on facebook and put it into a regular markdown link, prefixed by `gimmick:FacebookLike`.

Example:

    [gimmick:FacebookLike](http://www.facebook.com)

Preview:

[gimmick:FacebookLike](http://www.facebook.com)

Arguments:

* **layout**
  * is one of [ 'standard', 'boxcount', 'buttoncount' ]
  * defines the layout style of the like button
  * default is 'standard'
* **showfaces**
  * *true* or *false*
  * whether or not to show the profile images along with the comments
  * default is *true*

More Examples:

    1. [gimmick:FacebookLike ( layout: 'standard', showfaces: false) ](http://www.facebook.com)
    2. [gimmick:FacebookLike ( layout: 'boxcount', showfaces: false) ](http://www.facebook.com)
    3. [gimmick:FacebookLike ( layout: 'buttoncount') ](http://www.facebook.com)

1. [gimmick:FacebookLike ( layout: 'standard', showfaces: false) ](http://www.facebook.com)

2. [gimmick:FacebookLike ( layout: 'boxcount', showfaces: false) ](http://www.facebook.com)

3. [gimmick:FacebookLike ( layout: 'buttoncount') ](http://www.facebook.com)

For more info and previews, check the [Facebook developer page](http://developers.facebook.com/docs/reference/plugins/like/).

* * *
Fork me on GitHub - Ribbon
--------------------------

The popular github ribbon that is also present on this page. See the [github page]() for a preview of the colors.

Example:

    [gimmick:ForkMeOnGitHub](http://www.github.com/Dynalon/mdwiki)

or with options:

    [gimmick:ForkMeOnGitHub (position: 'left', color: 'darkblue') ](http://www.github.com/Dynalon/mdwiki)

Arguments:

* **color**
  * is one of [ 'red', 'darkblue', 'green', 'orange', 'white', 'gray' ]
  * defines the color of the ribbon
* **position**
  * is one of [ 'left', 'right' ]
  * defines the upper-corner position of the ribbon

Note: To display the ribbon on every page, put the gimmick link into the `navigation.md` file.

* * *

Google Maps
-----------

Allows to embed a basic map from [Google Maps](http://maps.google.com), centering at any given address specified via the link target.

Example Code:

    [gimmick:googlemaps](Madison Square Garden, NY)

    [gimmick:googlemaps(maptype: 'terrain', zoom: 9, marker: 'false')](Eiffel Tower, Paris)

    [gimmick:googlemaps(maptype: 'satellite', zoom: 17)](Colloseum, Rome, Italy)

Arguments:

* **maptype**
  * is one of [ 'terrain', 'roadmap', 'satellite', 'hybrid' ]
  * defined the type of the map
* **zoom**
  * Defines the zoom level of the map (default: 11)
  * The minimum/maximum zoomlevel depends heavily on the **maptype**. Best way to find a fitting value is just try'n'error.

Preview:

[gimmick:googlemaps](Madison Square Garden, NY)

[gimmick:googlemaps(maptype: 'terrain', zoom: 9, marker: 'false')](Eiffel Tower, Paris)

[gimmick:googlemaps({maptype: 'satellite', zoom: 17})](Colloseum, Rome, Italy)
* * *

Math
-----
Math formulas are realized through the [MathJax](http://www.mathjax.org) library.

You can then add math formulas by putting them into a verbatim block followed by the `math` keyword using LaTeX syntax:

    ```math
    x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
    ```

```math
    x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```


More examples:

```math
\frac{\partial \phi}{\partial x} \vert_b = \frac{1}{\Delta x/2}(\phi_0-\phi_b)
```

```math
\int u \frac{dv}{dx}\,dx=uv-\int
\frac{du}{dx}v\,dx\lim_{n\rightarrow \infty }
\left (  1 +\frac{1}{n} \right )^n
```

Note: The MathJax library is very large and loads some more dependencies like fonts. It is not part of mdwiki but loaded from the web - it does therefore not work when offline.

Twitter
-------

Creates a simple twitter follow button from a given twitter screen name.

Example:

    [gimmick:TwitterFollow](@timodoerr)

Preview:

[gimmick:TwitterFollow](@timodoerr)

Youtube
-------

Whenever you insert a regular link with an empty caption that points to a video on `youtube.com` or `youtu.be`, the link is automatically turned into an embedded iframe, which will display a preview thumbnail of the video on your website.

Example:

    This will show the video preview on your website:
    [](http://www.youtube.com/watch?v=RMINSD7MmT4)

[](http://www.youtube.com/watch?v=RMINSD7MmT4)

To omit the preview and just get a regular link, add a caption:

    [Click to see an awesome video](http://www.youtube.com/watch?v=RMINSD7MmT4)

[Click to see an awesome video](http://www.youtube.com/watch?v=RMINSD7MmT4)

* * *

Disqus
------

Adds comment / forum style functionality to your website. You first need to [signup with disqus](http://disqus.com) and use your disqus shortname as the link target.

    [gimmick:Disqus](your_disqus_shortname)

Preview:

[gimmick:Disqus](mdwiki)

Disqus is always embedded at the bottom of a page, so scroll down this site to see a preview.

