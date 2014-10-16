(function($) {
    'use strict';


    if (window.location.href.indexOf('SpecRunner') >= 0)
        $.initMDwiki(undefined, false);
    else
        $.initMDwiki(undefined, true);


}(jQuery));
