(function($) {
    //'use strict';
    var jsUrl = 'http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.js';
    var cssUrl = 'http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.css';

    function leaflet_map($link, opt, linkText) {
        var $maps_links = $link;
        var counter = (new Date()).getTime ();
        return $maps_links.each(function(i, link) {
            var $this = $(link);
            var default_options = {};
            var options = $.extend({}, default_options, opt);

            if (options.address === undefined) {
                options.address = $this.attr ('href');
            }
            var div_id = 'leaflet-map-' + Math.floor (Math.random() * 100000);
            var $mapsdiv = $('<div class="md-external md-external-noheight md-external-nowidth" id="' + div_id + '"/>');
            $this.replaceWith ($mapsdiv);

            $mapsdiv.css('height','580px');
            $mapsdiv.css('width','580px');
            // now leats create a map out of the div
            // create a map in the "map" div, set the view to a given place and zoom
            var map = L.map(div_id).setView([51.505, -0.09], 13);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // add a marker in the given location, attach some popup content to it and open the popup
            L.marker([51.5, -0.09]).addTo(map);
        });
    }

    var leafletGimmick = {
        name: 'Leaflet.js',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'leaflet', leaflet_map);
            $.md.registerCss(this, cssUrl, {
                stage: 'skel_ready'
            });

            $.md.registerScript(this, jsUrl, {
                loadstage: 'pregimmick',
                finishstage: 'pregimmick'
            });
        }
    };
    $.md.registerGimmick(leafletGimmick);
}(jQuery));
