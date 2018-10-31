// FIXME: This souldn't be implemented as a gimmick
// FIXME: It should be a parser ran in the gimmick stage (a little like prism)

(function($) {
    /*var alertGimmick = new MDwiki.Gimmick.Gimmick('alert');
    var alertHandler = new MDwiki.Gimmick.GimmickHandler('multiline');
    alertHandler.loadStage = 'ready';

    alertHandler.callback = function(params, done) {
        // extract params fields
        var text = params.text;
        var domElement = params.domElement;

        var type = get_alert_type(text);
        if (type === null) return;

        var $p = $('p');
        $p.addClass('alert');
        if (type === 'note') {
            $p.addClass('alert-info');
        } else if (type === 'hint') {
            $p.addClass('alert-success');
        } else if (type === 'warning') {
            $p.addClass('alert-warning');
        } else if (type === 'danger') {
            $p.addClass('alert-danger');
        }
        $p.text(text);
        $(domElement).replaceWith($p);
        done();
    };

    alertGimmick.addHandler(alertHandler);
    $.md.wiki.gimmicks.registerGimmick(alertGimmick);*/
    
    $.md.wiki.stages.getStage('gimmick').subscribe(alertify);

    /// Obtain the type of the alert by checking it's `trigger` word
    function get_alert_type(text) {
        if(!text) return null;
        // TODO: add other language support;
        // TODO: check if it would be possible to use some sort of config file to do it
        var note = ['note', 'beachte'];
        var warning = [
            'achtung', 'attention', 'warnung',
            'warning', 'atención', 'guarda', 'advertimiento'
        ];
        var hint = ['hint', 'tipp', 'tip', 'hinweis', 'astuce'];
        var danger = ['danger', 'achtung', 'peligro'];
        var exp = note
            .concat(warning)
            .concat(hint)
            .concat(danger);
        var txt = text.toLowerCase();

        // check against each expression
        var returnval = null;
        $.each(exp, function (i, trigger) {
            // we match only paragraphs in wich the `trigger` expression
            // is followed by a '!' or a ':'
            var re = new RegExp('^' + trigger + '\s?(!|:)+.*', 'i');
            if(txt.match(re) !== null) {
                if ($.inArray(trigger, note) >= 0)
                {
                    returnval = 'note';
                    return false; // stops the $.each function since we have found the type
                } else if ($.inArray(trigger, warning) >=0) {
                    returnval = 'warning';
                    return false;
                } else if ($.inArray(trigger, hint) >= 0) {
                    returnval = 'hint';
                    return false;
                } else if ($.inArray(trigger, danger) >= 0) {
                    returnval = 'danger';
                    return false;
                }
            }
        });
        return returnval;
    }

    // Search all 
    function alertify(done) {
        // Get all the paragraph in the document
        var $paragraphs = $('div').find('p');
        
        $paragraphs.each(function(i, $p) {
            var type = get_alert_type($p.innerText);
            if(type === null) return;
            
            $p.className += ' alert';
            switch(type) {
            case 'note':
                $p.className += ' alert-info';
                break;
            
            case 'warning':
                $p.className += ' alert-warning';
                break;
            
            case 'hint':
                $p.className += ' alert-success';
                break;

            case 'danger':
                $p.className += ' alert-danger';
                break;
            }
        });

        done();
    }
}(jQuery));