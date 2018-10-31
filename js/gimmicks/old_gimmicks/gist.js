(function($){
    'use strict';

    function gist($links, opt, href) {
        $().lazygist('init');
        return $links.each(function(i,link) {
            var $link = $(link);
            var gistDiv = $('<div class="gist_here" data-id="' + href + '" />');
            $link.replaceWith(gistDiv);
            gistDiv.lazygist({
                // we dont want a specific file so modify the url template
                url_template: 'https://gist.github.com/{id}.js?'
            });
        });
    }

    var gistGimmick = new MDwiki.Core.Gimmick();
    gistGimmick.addHandler('gist', gist);
    $.md.wiki.gimmicks.registerGimmick(gistGimmick);
}(jQuery));


 /**
 * Lazygist v0.2pre
 *
 * a jQuery plugin that will lazy load your gists.
 *
 * since jQuery 1.7.2
 * https://github.com/tammo/jquery-lazy-gist
 *
 * Copyright, Tammo Pape
 * http://tammopape.de
 *
 * Licensed under the MIT license.
 */

(function( $, window, document, undefined ){
    "use strict";

    //
    // note:
    // this plugin is not stateful
    // and will not communicate with own instances at different elements
    //

    var pluginName = "lazygist",
    version = "0.2pre",

    defaults = {
        // adding the ?file parameter to choose a file
        'url_template': 'https://gist.github.com/{id}.js?file={file}',

        // if these are strings, the attributes will be read from the element
        'id': 'data-id',
        'file': 'data-file'
    },

    options,

    // will be replaced
    /*jshint -W060 */
    originwrite = document.write,

    // stylesheet urls found in document.write calls
    // they are cached to write them once to the document,
    // not three times for three gists
    stylesheets = [],

    // cache gist-ids to know which are already appended to the dom
    ids_dom = [],

    // remember gist-ids if their javascript is already loaded
    ids_ajax = [],

    methods = {

        /**
         * Standard init function
         * No magic here
         */
        init : function( options_input ){

            // default options are default
            options = $.extend({}, defaults, options_input);

            // can be reset
            /*jshint -W061 */
            document.write = _write;

            $.each(options, function(index, value) {
                if(typeof value !== 'string') {
                    throw new TypeError(value + ' (' + (typeof value) + ') is not a string');
                }
            });

            return this.lazygist('load');
        },

        /**
         * Load the gists
         */
        load : function() {
            // (1) iterate over gist anchors
            // (2) append the gist-html through the new document.write func (see _write)

            // (1)
            return this.filter('[' + options.id + ']').each(function(){

                var id = $(this).attr(options.id),
                    file = $(this).attr(options.file),
                    src;

                if( id !== undefined ) {

                    if( $.inArray(id, ids_ajax) !== -1 ) {
                        // just do nothin, if gist is already ajaxed
                        return;
                    }

                    ids_ajax.push(id);

                    src = options.url_template.replace(/\{id\}/g, id).replace(/\{file\}/g, file);

                    // (2) this will trigger our _write function
                    $.getScript(src, function() {
                    });
                }
            });
        },

        /**
         * Just reset the write function
         */
        reset_write: function() {
            document.write = originwrite;

            return this;
        }
    };

    /**
     * private special document.write function
     *
     * Filters the css file from github.com to add it to the head - once -
     *
     * It has a fallback to keep flexibility with other scripts as high as possible
     * (create a ticket if it messes things up!)
     *
     * Keep in mind, that a call to this function happens after
     * an ajax call by jQuery. One *cannot* know which gist-anchor
     * to use. You can only read the id from the content.
     */
    function _write( content ) {

        var expression, // for regexp results
            href, // from the url
            id; // from the content

        if( content.indexOf( 'rel="stylesheet"' ) !== -1 ) {
            href = $(content).attr('href');

            // check if stylesheet is already inserted
            if ( $.inArray(href, stylesheets) === -1 ) {

                $('head').append(content);
                stylesheets.push(href);
            }

        } else if( content.indexOf( 'id="gist' ) !== -1 ) {
            expression = /https:\/\/gist.github.com\/.*\/(.*)#/.exec(content);
            id = expression[1];

            if( id !== undefined ) {

                // test if id is already loaded
                if( $.inArray(id, ids_dom) !== -1 ) {
                    // just do nothin, if gist is already attached to the dom
                    return;
                }

                ids_dom.push(id);

                $('.gist_here[data-id=' + id + ']').append(content);
            }
        } else {
            // this is a fallback for interoperability
            originwrite.apply( document, arguments );
        }
    }

    // method invocation - from jQuery.com
    $.fn[pluginName] = function( method ) {

        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));

        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );

        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.lazygist' );
        }
    };

    // expose version for your interest
    $.fn[pluginName].version = version;

})(jQuery, window, document);
