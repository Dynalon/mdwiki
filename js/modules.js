(function($) {
    'use strict';
    var licenses = ['MIT', 'BSD', 'GPL', 'GPL2', 'GPL3', 'LGPL', 'LGPL2', 'OTHER'];

    $.md.registerModule = function(module) {
        if (module.scripts instanceof Array) {
            $(module.scripts).each(function(i,e) {
                // check license
                if ($.inArray(this.license, licenses)) {
                    var availLicenses = JSON.stringify(licenses);
                    console.log('license ' + this.license + ' is not known.');
                    console.log('Known licenses:' + availLicenses);
                }
                // inject scripts into the dom
                // TODO
            });
        }
        $.md.modules.push(module);
        // inject css into the dom

        return;
    };
}(jQuery));
