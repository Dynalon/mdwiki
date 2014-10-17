// ugly, but the google loader requires the callback fn
// to be in the global scope
var googlemapsLoadDone;

function googlemapsReady() {
    googlemapsLoadDone.resolve();
}

(function($) {
    //'use strict';
    var scripturl = 'http://maps.google.com/maps/api/js?sensor=false&callback=googlemapsReady';

    function googlemaps(trigger, text, options, domElement) {
        var $maps_links = $(domElement);
        var counter = (new Date()).getTime ();
        return $maps_links.each(function(i,e) {
            var $link = $(e);
            var default_options = {
                zoom: 11,
                marker: true,
                scrollwheel: false,
                maptype: 'roadmap'
            };
            var options = $.extend({}, default_options, options);
            if (options.address === undefined) {
                options.address = $link.attr ('href');
            }
            var div_id = 'google-map-' + Math.floor (Math.random() * 100000);
            var $mapsdiv = $('<div class="md-external md-external-nowidth" id="' + div_id + '"/>');
            /* TODO height & width must be set AFTER the theme script went through
            implement an on event, maybe?
            if (options["width"] !== undefined) {
                $mapsdiv.css('width', options["width"] + "px");
                options["width"] = null;
            }
            if (options["height"] !== undefined) {
                $mapsdiv.css('height', options["height"] + "px");
                options["height"] = null;
            }
            */
            $link.replaceWith ($mapsdiv);
            // the div is already put into the site and will be formated,
            // we can now run async
            set_map (options, div_id);
        });
    }
    function set_map(opt, div_id) {

        // google uses rather complicated mapnames, we transform our simple ones
        var mt = opt.maptype.toUpperCase ();
        opt.mapTypeId = google.maps.MapTypeId[mt];
        var geocoder = new google.maps.Geocoder ();

        // geocode performs address to coordinate transformation
        geocoder.geocode ({ address: opt.address }, function (result, status) {
            if (status !== 'OK') {
                return;
            }

            // add the retrieved coords to the options object
            var coords = result[0].geometry.location;

            var options = $.extend({}, opt, { center: coords  });
            var gmap = new google.maps.Map(document.getElementById(div_id), options);
            if (options.marker === true) {
                var marker = new google.maps.Marker ({ position: coords, map : gmap});
            }
        });
    }

    var googleMapsGimmick = new MDwiki.Gimmick.Gimmick('googlemaps');
    googleMapsGimmick.initFunction(function(stageLoader) {
        googlemapsLoadDone = $.Deferred();

        // googleMapsGimmick.subscribeGimmick('googlemaps', googlemaps);
        // load the googlemaps js from the google server
        var script = new MDwiki.Gimmick.ScriptResource (scripturl);
        googleMapsGimmick.registerScriptResource(script);

        stageLoader('pregimmick').subscribe(function(done) {
            // defer the pregimmick phase until the google script fully loaded
            googlemapsLoadDone.done(function() {
                done();
            });
        });
    });
    var handler = new MDwiki.Gimmick.GimmickHandler('link', googlemaps);
    googleMapsGimmick.addHandler(handler);
    $.md.wiki.gimmicks.registerGimmick(googleMapsGimmick);
}(jQuery));
