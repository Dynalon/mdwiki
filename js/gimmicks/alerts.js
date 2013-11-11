(function($) {
    //'use strict';
    var alertsGimmick = {
        name: 'alerts',
        // TODO
        //version: $.md.version,
        load: function() {
            $.md.stage('bootstrap').subscribe(function(done) {
                createAlerts();
                done();
            });
        }
    };
    $.md.registerGimmick(alertsGimmick);

    // takes a standard <img> tag and adds a hyperlink to the image source
    // needed since we scale down images via css and want them to be accessible
    // in original format
    function createAlerts() {
        var matches = $(select_paragraphs());
        matches.each(function() {
            var $p = $(this.p);
            var type = this.alertType;
            $p.addClass('alert');

            if (type === 'note') {
                $p.addClass('alert-info');
            } else if (type === 'hint') {
                $p.addClass('alert-success');
            } else if (type === 'warning') {
                $p.addClass('alert-warning');
            }
        });
    }

    // picks out the paragraphs that start with a trigger word
    function select_paragraphs() {
        var note = ['note', 'beachte' ];
        var warning = [ 'achtung', 'attention', 'warnung', 'warning', 'atención', 'guarda', 'advertimiento' ];
        var hint = ['hint', 'tipp', 'tip', 'hinweis'];
        var exp = note.concat(warning);
        exp = exp.concat(hint);
        var matches = [];

        $('p').filter (function () {
            var $par = $(this);
            // check against each expression
            $(exp).each (function (i,trigger) {
                var txt = $par.text().toLowerCase ();
                // we match only paragrachps in which the 'trigger' expression
                // is follow by a ! or :
                var re = new RegExp (trigger + '(:|!)+.*','i');
                var alertType = 'none';
                if (txt.match (re) !== null) {
                    if ($.inArray(trigger, note) >= 0) {
                        alertType = 'note';
                    } else if ($.inArray(trigger, warning) >= 0) {
                        alertType = 'warning';
                    } else if ($.inArray(trigger, hint) >= 0) {
                        alertType = 'hint';
                    }
                    matches.push ({
                        p: $par,
                        alertType: alertType
                    });
                }
            });
        });
        return matches;
    }
}(jQuery));
