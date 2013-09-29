Customizing
===========

Theming
-------

### Theme chooser
There is a special gimmick `ThemeChooser` that will add a submenu entry to the navigation bar with all available themes. Enable it by adding

    [gimmick:themechooser](Choose theme)

to the `navigation.md` (or into each page individually).

### Selecting a theme

In addition of the theme chooser, you can manually set a specific theme:

    [gimmick:theme](flatly)

To apply the theme globally for all files, put the entry into `navigation.md`. You can also switch the "inverse" mode, which will change colors for some themes (see <http://www.bootswatch.com/> for details)

    [gimmick:theme (inverse: true)](flatly)

Note: Only the default `bootstrap` theme is bundled with MDwiki. All other themes require internet connection, as the styles are dynamically loaded on demand.

Configuration
-------------

You can create a `config.json` file in the same folder as the `mdwiki.html` file which is then used for configuration. The file has to be valid JSON. Currently these options are available:

  * `UseSideNav: false` - disable the side navigation

Note: More configuration options will be available in future versions of MDwiki
