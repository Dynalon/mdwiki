(function($) {
    'use strict';
    function favicon($link, opt, text) {

        var default_options = {
            width:    16,   /* image width          */
            height:   16,   /* image height         */
            alt:      '',   /* alternative favicon  */
            domain:   '',   /* favicon domain       */
            caption:  text, /* link caption         */
            target:   '',   /* link target          */
            cssClass: ''    /* link css class       */
        };
        var options = $.extend ({}, default_options, opt);

        return $link.each( function(i,e){

            var $this = $(e);

            var htmlImage = '<img src="https://www.google.com/s2/favicons?' +
                (options.domain ? 'domain=' + options.domain : 'domain_url=' + e) +
                (options.alt ? '&alt=' + options.alt : '') +
                '" width="' + options.width + '"' +
                ' height="' + options.height + '"' +
                ' alt="favicon"' +
                '>';

            var htmlLink = '<a href="' + e + '"' +
                (options.target ? ' target="' + options.target + '"' : '') +
                (options.cssClass ? ' class="' + options.cssClass + '"' : '') +
                '>' +
                htmlImage +
                (options.caption ? ' ' + options.caption : '') +
                '</a>';

            $this.replaceWith(htmlLink);
        });
    }
    var faviconGimmick = {
        name: 'favicon',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'favicon', favicon);
            $.md.registerScript(this, '', {
                license: 'LGPL',
                loadstage: 'postgimmick',
                finishstage: 'all_ready'
            });
        }
    };
    $.md.registerGimmick(faviconGimmick);

}(jQuery));
