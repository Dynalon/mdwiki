// ugly, but the google loader requires the callback fn
// to be in the global scope
var googlemapsLoadDone;

function googlemapsReady() {
    googlemapsLoadDone.resolve();
}

(function($) {
    //'use strict';
    var scripturl = 'http://maps.google.com/maps/api/js?sensor=false&callback=googlemapsReady';

    function googlemaps($links, opt, text) {
        var $maps_links = $links;
        var counter = (new Date()).getTime ();
        return $maps_links.each(function(i,e) {
            var $link = $(e);
            var default_options = {
                zoom: 11,
                marker: true,
                scrollwheel: false,
                maptype: 'roadmap'
            };
            var options = $.extend({}, default_options, opt);
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

    var googleMapsGimmick = {
        name: 'googlemaps',
        version: $.md.version,
        once: function() {
            googlemapsLoadDone = $.Deferred();

            // register the gimmick:googlemaps identifier
            $.md.linkGimmick(this, 'googlemaps', googlemaps);

            // load the googlemaps js from the google server
            $.md.registerScript(this, scripturl, {
                license: 'EXCEPTION',
                loadstage: 'skel_ready',
                finishstage: 'bootstrap'
            });

            $.md.stage('bootstrap').subscribe(function(done) {
                // defer the pregimmick phase until the google script fully loaded
                if ($.md.triggerIsActive('googlemaps')) {
                    googlemapsLoadDone.done(function() {
                        done();
                    });
                } else {
                    // immediately return as there will never a load success
                    done();
                }
            });
        }
    };
    $.md.registerGimmick(googleMapsGimmick);
}(jQuery));
