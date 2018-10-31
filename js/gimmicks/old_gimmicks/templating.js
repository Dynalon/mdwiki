(function($, Handlebars) {
    var templateGimmick = new MDwiki.Gimmick.Gimmick('template');
    var templateHandler = new MDwiki.Gimmick.GimmickHandler('singleline');
    templateHandler.loadStage = 'ready';

    templateHandler.callback = function(ref, done) {
        var options = ref.options;
        var view = options.view;
        var model = options.model;
        if (! (model && view)) return;

        var isMarkdown = options.view.endsWith('.md') || options.view.endsWith ('.mdt') ||
            options.view.endsWith('.mdown');

        // TODO proper url expansion
        var view_dfd = $.get(view);
        var model_dfd = $.get(model);
        // TODO error handling and call done() when model/view couldnt be loaded or parsed etc.
        $.when(view_dfd, model_dfd).then(function(viewresult, modelresult) {
            var viewdata = viewresult[0];
            var modeldata = modelresult[0];
            // this will fail as we only have handlebars runtime :( need to include full stack?
            var template = Handlebars.compile(viewdata);
            var output = template.render(modeldata);
            var new_elements;
            if (isMarkdown) {
                var html = marked(output);
                // the markdown parser will create a <p> that we don't want
                new_elements = $(html).children();
            } else {
                new_elements = $(output);
            }
            $(ref.domElement).after(new_elements);
            $(ref.domElement).remove();
            done();
        });
    };

    templateGimmick.addHandler(templateHandler);
    $.md.wiki.gimmicks.registerGimmick(templateGimmick);

})(jQuery, Handlebars);
