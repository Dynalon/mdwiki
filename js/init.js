(function($) {
    'use strict';

    // hide the whole page so we dont see the DOM flickering
    // will be shown upon page load complete or error
    $('html').addClass('md-hidden-load');

    $.md = {};
    // the location of the main markdown file we display
    $.md.mainHref = '';

    // the in-page anchor that is specified after the !
    $.md.inPageAnchor = '';

}(jQuery));
