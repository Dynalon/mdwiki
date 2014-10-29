(function($) {

    //'use strict';
    var alertsGimmick = new MDwiki.Gimmick.Gimmick('alert');
    var alertHandler = new MDwiki.Gimmick.GimmickHandler('singleline');
    alertHandler.callback = function(trigger, text, options, domElement) {
        var type = get_alert_type(text);
        if (type === null) return;

        var $p = $('<p/>');
        $p.addClass('alert');
        if (type === 'note') {
            $p.addClass('alert-info');
        } else if (type === 'hint') {
            $p.addClass('alert-success');
        } else if (type === 'warning') {
            $p.addClass('alert-warning');
        }
        $p.text(text);
        $(domElement).replaceWith($p);
    };
    alertsGimmick.addHandler(alertHandler);
    $.md.wiki.gimmicks.registerGimmick(alertsGimmick);

    function get_alert_type(text) {
        var note = ['note', 'beachte' ];
        var warning = [ 'achtung', 'attention', 'warnung', 'warning', 'atención', 'guarda', 'advertimiento' ];
        var hint = ['hint', 'tipp', 'tip', 'hinweis'];
        var exp = note.concat(warning);
        exp = exp.concat(hint);
        var txt = text.toLowerCase ();

        // check against each expression
        var returnval = null;
        $(exp).each (function (i,trigger) {
            // we match only paragrachps in which the 'trigger' expression
            // is follow by a ! or :
            var re = new RegExp (trigger + '(:|!)+.*','i');
            if (txt.match (re) !== null) {
                if ($.inArray(trigger, note) >= 0) {
                    returnval = 'note';
                } else if ($.inArray(trigger, warning) >= 0) {
                    returnval = 'warning';
                } else if ($.inArray(trigger, hint) >= 0) {
                    returnval = 'hint';
                }
            }
        });
        return returnval;
    }
}(jQuery));
