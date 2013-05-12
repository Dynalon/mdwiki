(function($) {
    function set_map(opt, div_id) {

        // google uses rather complicated mapnames, we transform our simple ones
        var mt = opt.maptype.toUpperCase ();
        opt.MapTypeId = google.maps.MapTypeId[mt];

        var geocoder = new google.maps.Geocoder ();

        // geocode performs address to coordinate transformation
        geocoder.geocode ({ address: opt.address }, function (result, status) {
            if (status != "OK") return;

            // add the retrieved coords to the options object
            var coords = result[0].geometry.location;

            var options = $.extend({}, opt, { center: coords  });
            var gmap = new google.maps.Map(document.getElementById(div_id), options);
            if (options.marker === true) {
                var marker = new google.maps.Marker ({ position: coords, map : gmap});
            }
        });
    }
    var methods = {
        googlemaps: function(opt) {
            $maps_links = $(this);
            var counter = (new Date).getTime ();
            return $maps_links.each(function() {
                $this = $(this);
                default_options = {
                    zoom: 11,
                    marker: true,
                    maptype: 'roadmap'
                }
                var options = $.extend ({}, default_options, opt);


                if (options["address"] === undefined) {
                    options.address = $this.attr ('href');
                }
                var div_id = "google-map-" + Math.floor (Math.random() * 100000);
                var $mapsdiv = $('<div class="md-external" id="' + div_id + '"/>');
                /* TODO height & width must be set AFTER the theme script went through
                implement an on event, maybe?
                if (options["width"] !== undefined) {
                   console.log (options);
                    $mapsdiv.css('width', options["width"] + "px");
                    options["width"] = null;
                }
                if (options["height"] !== undefined) {
                    $mapsdiv.css('height', options["height"] + "px");
                    options["height"] = null;
                }
                */

                $this.replaceWith ($mapsdiv);
                // the div is already put into the site and will be formated,
                // we can now run async
                set_map (options, div_id);
            });
        }
    };
    $.gimmicks.methods = $.fn.gimmicks.methods = $.extend({}, $.fn.gimmicks.methods, methods);
}(jQuery));
