(function($) {
    'use strict';
    // register our $.md object
    $.md = function (method){
        if ($.md.publicMethods[method]) {
            return $.md.publicMethods[method].apply(this,
                Array.prototype.slice.call(arguments, 1)
            );
        } else {
            $.error('Method ' + method + ' does not exist on jquery.md');
        }
    };

    var stages = [];

    function init() {
        $.md.config = {};
        $.md.mainHref = '';

        stages = [
            $.Stage('init'),

            // loads config, initial markdown and navigation
            $.Stage('load'),

            // will transform the markdown to html
            $.Stage('ready'),

            // after we have a solid html skeleton
            $.Stage('skel_ready'),

            // after we have bootstrapified the skeleton
            $.Stage('bootstrap_ready'),

            // postprocess
            $.Stage('postprocess'),

            $.Stage('all_ready')
        ];

        $.md.stages = function(name) {
            var m = $.grep(stages, function(e,i) {
                return e.name === name;
            });
            if (m.length === 0) {
                $.error('A stage by name ' + name + '  does not exist');
            } else {
                return m[0];
            }
        };
    }
    init();

    function resetStages() {
        var old_stages = stages;
        stages = [];
        $(old_stages).each(function(i,e) {
            stages.push($.Stage(e.name));
        });
    }

    var publicMethods = {};
    $.md.publicMethods = $.extend ({}, $.md.publicMethods, publicMethods);

    function registerFetchMarkdown() {
        var transformMarkdown = function(markdown) {
            var options = {
                gfm: true,
                tables: true,
                breaks: true
            };
            marked.setOptions(options);

            // get sample markdown
            var uglyHtml = marked(markdown);
            return uglyHtml;
        };
        var md = '';

        $.md.stages('load').subscribe(function(done) {
            $.ajax($.md.mainHref).done(function(data) {
                // TODO do this elsewhere
                md = data;
                var len = $.md.mainHref.lastIndexOf('/');
                var baseUrl = $.md.mainHref.substring(0, len+1);
                $.md.baseUrl = baseUrl;
                done();
            });
        });

        $.md.stages('ready').subscribe(function(done) {
            var uglyHtml = transformMarkdown(md);
            $('#md-content').html(uglyHtml);
            md = '';
            done();
        });
    }

    function registerCreateNavigation() {
        // assemble a navigation
        var insertNavLinks = function(config) {
            var nav = $.md.config.Navigation;
            if (nav === undefined) {
                return;
            }
            for(var i=0;i<nav.length; i++) {
                var anchor = $('<a/>');
                anchor.attr('href', nav[i].Href);
                anchor.text(nav[i].Text);
                anchor.appendTo('#md-menu');
            }
        };
        $.md.stages('postprocess').subscribe(function(done) {
            processPageLinks($('#md-menu'));
            done();
        });

        $.md.stages('ready').subscribe(function(done) {
            insertNavLinks($.md.config);
            done();
        });
    }

    // modify internal links so we load them through our engine
    function processPageLinks(domElement, baseUrl) {
        var html = $(domElement);
        if (baseUrl === undefined) {
            baseUrl = '';
        }
        html.find('a, img').each(function(i,e) {
            var link = $(e);
            // link must be jquery collection
            var isImage = false;
            var hrefAttribute = 'href';

            if (!link.attr(hrefAttribute)) {
                isImage = true;
                hrefAttribute = 'src';
            }
            var href = link.attr(hrefAttribute);
            if ($.md.util.isRelativeUrl(href)) {
                var newHref = baseUrl + href;
                if (!isImage) {
                    link.attr(hrefAttribute, '#' + newHref);
                } else {
                    link.attr(hrefAttribute, newHref);
                }
            }
        });
    }

    function registerFetchConfig() {

        $.md.stages('init').subscribe(function(done) {
            $.ajax('config.json').done(function(data){
                $.md.config = $.parseJSON(data);
                done();
            });
        });
    }

    function registerClearContent() {

        $.md.stages('init').subscribe(function(done) {
            $('#md-all').empty();
            var skel ='<div id="md-body"><div id="md-title"></div><div id="md-menu">'+
                '</div><div id="md-content"></div></div>';
            $('#md-all').prepend($(skel));
            //$('#md-content').empty();
            done();
        });

    }
    function loadContent(href) {

        $.md.mainHref = href;

        registerCreateNavigation();
        registerFetchMarkdown();
        registerClearContent();

        $.md.stages('ready').subscribe(function(done) {
            $.md('createBasicSkeleton');
            done();
        });

        $.md.stages('skel_ready').subscribe(function(done) {
            $.mdbootstrap('init');
            $.mdbootstrap('bootstrapify');
            done();
        });
        $.md.stages('bootstrap_ready').subscribe(function(done){
            processPageLinks($('#md-content'), $.md.baseUrl);
            done();
        });

        runStages();

    }

    function runStages() {

        // wire the stages up
        $.md.stages('init').done(function() {
            $.md.stages('load').run();
        });
        $.md.stages('load').done(function() {
            $.md.stages('ready').run();
        });
        $.md.stages('ready').done(function() {
            $.md.stages('skel_ready').run();
        });
        $.md.stages('skel_ready').done(function() {
            $.md.stages('bootstrap_ready').run();
        });
        $.md.stages('bootstrap_ready').done(function() {
            $.md.stages('postprocess').run();
        });
        $.md.stages('postprocess').done(function() {
            $.md.stages('all_ready').run();
        });
        $.md.stages('all_ready').done(function() {
            // reset the stages for next iteration
            resetStages();
        });

        // trigger the whole process by runing the init stage
        $.md.stages('init').run();
        return;

    }
    $(document).ready(function () {

        // stage init stuff
        registerFetchConfig();

        if (window.location.hash === '') {
            window.location.hash = '#index.md';
        }
        var href = window.location.hash.substring(1);

        $(window).bind('hashchange', function () {
            var href = window.location.hash.substring(1);
            var hash = window.location.hash;
            $.md.currentHash = hash;
            loadContent(href);
        });

        loadContent(href);
    });
}(jQuery));
