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

UML Diagrams via yUML.me
-----

Embeds diagrams from the excellent [yUML.me](http://yuml.me) service (see their website for documentation).

Examples:

[gimmick:yuml]( [HttpContext]uses -.->[Response] )

    [gimmick:yuml]( [HttpContext]uses -.->[Response] )
- - -
[gimmick:yuml (type: 'class')]([User|+Forename;+Surname;+HashedPassword;-Salt])

    [gimmick:yuml]([User|+Forename+;Surname;+HashedPassword;-Salt|+Login();+Logout()])
- - -
[gimmick:yuml (type: 'activity', style: 'plain') ]( `Make Coffee´->`want more coffee´ )

    [gimmick:yuml (type: 'activity', style: 'plain') ]( `Make Coffee´->`want more coffee´ )

- - -
[gimmick:yuml (type: 'usecase', scale: 150) ]( [Customer]-`Sign In´, [Customer]-`Buy Products´ )

    [gimmick:yuml (diag: 'usecase', scale: 150) ]( [Customer]-`Sign In´, [Customer]-`Buy Products´ )


Arguments

* **direction**
  * is one of [ 'TB', 'LR' ]
  * direction of the diagram: top-to-bottom or left-to-right
* **scale**
  * is an integer percentage value, i.e. 150 or 200
  * defines the scaling applied to the diagram in percent, 100% = no scaling
* **type**
  * is one of [ 'class', 'activity', 'usecase' ]
  * type of the UML diagram
* **style**
  * is one of [ 'plain', 'scruffy' ]
  * defines the applied theme, *plain* for clean and *scruffy* for comic-style look


Math
-----
[gimmick: math]()
Math formulas are realized through the [MathJax](http://www.mathjax.org) library. To enable math formulas on a page, the `math` gimmick must be loaded by adding this link anywhere in the file:

    [gimmick: math]()

To enable math for all sites, put the above link into the `navigation.md` file. Putting this link onto the site will load MathJax dynamically from a CDN provider.

Note: The MathJax script is very large and loads some more dependencies like fonts. Using the math gimmick might result in slow page loads.

### Math inserted to new paragraph  

You can add math formulas by putting them between to `$$` signs and use LateX syntax:

    $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

### Inline equations

Inline equations can be inserted by surrounding them with the delimiters `\\(` and `\\)`:

    Diameter \\( d \\) of a circle given area \\( A \\) can by obtained via \\(d=\sqrt{\frac{4A}{\pi}}\\)

Will show as: Diameter \\( d \\) of a circle given area \\( A \\) can by obtained via \\(d=\sqrt{\frac{4A}{\pi}}\\)

### Some examples

$$ \frac{\partial \phi}{\partial x} \vert_b = \frac{1}{\Delta x/2}(\phi_0-\phi_b) $$

$$ \int u \frac{dv}{dx}\,dx=uv-\int
\frac{du}{dx}v\,dx\lim_{n\rightarrow \infty }
\left (  1 +\frac{1}{n} \right )^n
$$

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

Chart
-----

Adds a chart to the screen using data from your Markdown table.

#### Options

- labelColumn: This is a string that indicates which column will be used to label the data points. This String must be a direct match to your table header fro the column.
- dataColumns: This is an array of strings that indicated the column to be plotted. This String must be a direct match to your table header fro the column.
- canvasId: This is an ID for the generated chart. Defaults to a random number between 1-1000.
- chartOptions: This is an object that is passed to chartjs to configure its options. Refer to chartjs for documentation on available options.
- chartType:   This string is the type of chart render. Bar, Line, or Radar. Defaults to Line.

Note: Currently only support a single table on a page. You CAN have multiple charts from the same table.

    | #  | Sprint          | Points | Sum | Avg  | Note |
    | -  | --------        |------- | --- | ---- | ---- |
    | 1  | Sprint 1        | 6      | 6   | 6.0  | |
    | 2  | Sprint 2        | 6      | 12  | 6.0  | |
    | 3  | Sprint 3        | 15     | 27  | 9.0  | |
    | 4  | Sprint 4        | 9      | 36  | 9.0  | |
    | 5  | Sprint 5        | 6      | 42  | 8.4  | |
    | 6  | Sprint 6        | 9      | 51  | 8.5  | |
    
    [gimmick:chart ({dataColumns: ['Avg'], labelColumn: "Sprint", chartType: 'Line', width: '660px', height: '300px'})]()
    
    [gimmick:chart ({dataColumns: ['Avg'], labelColumn: "Sprint", chartType: 'Bar', width: '660px', height: '300px'})]()

Example:

| #  | Sprint          | Points | Sum | Avg  | Note |
| -  | --------        |------- | --- | ---- | ---- |
| 1  | Sprint 1        | 6      | 6   | 6.0  | |
| 2  | Sprint 2        | 6      | 12  | 6.0  | |
| 3  | Sprint 3        | 15     | 27  | 9.0  | |
| 4  | Sprint 4        | 9      | 36  | 9.0  | |
| 5  | Sprint 5        | 6      | 42  | 8.4  | |
| 6  | Sprint 6        | 9      | 51  | 8.5  | |

[gimmick:chart ({dataColumns: ['Avg'], labelColumn: "Sprint", chartType: 'Line', width: '660px', height: '300px'})]()

[gimmick:chart ({dataColumns: ['Avg'], labelColumn: "Sprint", chartType: 'Bar', width: '660px', height: '300px'})]()
