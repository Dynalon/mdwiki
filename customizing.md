Customizing
===========

Theme chooser
-------------

There is a special gimmick `ThemeChooser` that will add a submenu entry to the navigation bar with all available themes. Enable it by adding

    [gimmick:themechooser](Choose theme)

to the `navigation.md` (or into each page individually).

### Selecting a theme

You can manually set a specific theme that will be used if the ThemeChooser gimmick is not used or set to the default theme:

    [gimmick:theme](flatly)

This will set the default theme to `flatly`. You can see a list of the theme names in the `ThemeChooser` gimmick or on this page (select `Change theme` in the navbar).

To apply the theme globally for all files, put the entry into `navigation.md`. You can also switch the "inverse" mode, which will change colors for some themes (see <http://www.bootswatch.com/> for details)

    [gimmick:theme (inverse: true)](flatly)

Note: Only the default `bootstrap` theme is bundled with MDwiki and available offline. All other themes require internet connection, as the styles are dynamically loaded on demand.

Configuration
-------------

You can create a `config.json` file in the same folder as the `mdwiki.html` file which is then used for configuration. The file has to be valid JSON. Currently these options are available:

  * `useSideNav: false` - disable the side navigation
  * `lineBreaks: "original"` - Instead of using the [GFM] line breaks, use the original line breaking as [introduced by John Gruber][DaringFireball]:
    * line breaks in the markdown files are ignored, except if a line ends with two spaces
    * Default is `lineBreaks: "gfm"` (line breaks in markdown will create a new paragraph)
  * `additionalFooterText: ""`
    * Can be used to add text to the copyright footer at the bottom, like custom copyright notices.
    * Example: `additionalFooterText: "All content and images &copy; by John Doe"`
    * Default: `""` (empty string)

A sample `config.json` might thus look like this:

```javascript
{
    "useSideNav": true,
    "lineBreaks": "gfm",
    "additionalFooterText": "All content and images &copy; by John Doe"
}
```

Note: More configuration options will be available in future versions of MDwiki.

Hint: It is adviced that you create an empty config.json in each cases, to avoid 404 errors which will not get cached by your browser. Having an `config.json` file present thus will speed up page loading (even if its empty).

  [GFM]: https://help.github.com/articles/github-flavored-markdown
  [DaringFireball]: http://daringfireball.net/projects/markdown/
