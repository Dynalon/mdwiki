(function($, Hogan) {

    var templateGimmick = new MDwiki.Gimmick.Gimmick('template');
    var templateHandler = new MDwiki.Gimmick.GimmickHandler('singleline');

    templateHandler.callback = function(trigger, text, options, domElement) {
        if (options.load) {
            var isMarkdown = options.type === 'markdown' || false;
            var ending = '.html';
            if (isMarkdown) ending = '.md';

            var view = options.load + ending;
            var model = options.load + '.json';
            var view_dfd = $.get(view);
            var model_dfd = $.get(model);
            $.when(view_dfd, model_dfd).then(function(viewresult, modelresult) {
                var viewdata = viewresult[0];
                var modeldata = modelresult[0];
                var template = Hogan.compile(viewdata);
                var html = template.render(modeldata);
                if (isMarkdown)
                    html = marked(html);
                var $p = $('<p/>');
                $p.html(html);
                $(domElement).replaceWith($p);
            });
        } else {
            // TODO try/catch and output error msg
            if (!options || !options.data) return;
            var template = Hogan.compile(text);
            var html = template.render(JSON.parse(options.data));
            var $p = $('<p/>');
            $p.html(html);
            $(domElement).replaceWith($p);
        }
    };

    templateGimmick.addHandler(templateHandler);
    $.md.wiki.gimmicks.registerGimmick(templateGimmick);

})(jQuery, Hogan);
