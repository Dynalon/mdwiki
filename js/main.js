(function($) {
    'use strict';

    function init() {
        $.md.stages = [
            $.Stage('init'),

            // loads config, initial markdown and navigation
            $.Stage('load'),

            // will transform the markdown to html
            $.Stage('transform'),

            // HTML transformation finished
            $.Stage('ready'),

            // after we have a polished html skeleton
            $.Stage('skel_ready'),

            // will bootstrapify the skeleton
            $.Stage('bootstrap'),

            // before we run any gimmicks
            $.Stage('pregimmick'),

            // after we have bootstrapified the skeleton
            $.Stage('gimmick'),

            // postprocess
            $.Stage('postgimmick'),

            $.Stage('all_ready')
        ];

        $.md.stage = function(name) {
            var m = $.grep($.md.stages, function(e,i) {
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
        var old_stages = $.md.stages;
        $.md.stages = [];
        $(old_stages).each(function(i,e) {
            $.md.stages.push($.Stage(e.name));
        });
    }

    var publicMethods = {};
    $.md.publicMethods = $.extend ({}, $.md.publicMethods, publicMethods);

    function registerFetchMarkdown() {
        var transformMarkdown = function(markdown) {
            var options = {
                gfm: false,
                tables: true,
                breaks: false
            };
            marked.setOptions(options);

            // get sample markdown
            var uglyHtml = marked(markdown);
            return uglyHtml;
        };
        var md = '';

        $.md.stage('transform').subscribe(function(done) {
            $.ajax($.md.mainHref).done(function(data) {
                // TODO do this elsewhere
                md = data;
                var len = $.md.mainHref.lastIndexOf('/');
                var baseUrl = $.md.mainHref.substring(0, len+1);
                $.md.baseUrl = baseUrl;
                done();
            });
        });

        $.md.stage('ready').subscribe(function(done) {
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
        $.md.stage('bootstrap').subscribe(function(done) {
            processPageLinks($('#md-menu'));
            done();
        });

        $.md.stage('ready').subscribe(function(done) {
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

            if (!isImage && $.md.util.isGimmickLink(link)) {
                return;
            }
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

        $.md.stage('init').subscribe(function(done) {
            $.ajax('config.json').done(function(data){
                $.md.config = $.parseJSON(data);
                done();
            });
        });
    }

    function registerClearContent() {

        $.md.stage('init').subscribe(function(done) {
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

        // find out which link gimmicks we need
        $.md.stage('ready').subscribe(function(done) {
            $.md.findActiveLinkTrigger();
            $.md.runGimmicksOnce();
            $.md.loadRequiredScripts();
            done();
        });

        // wire up the load method of the modules
        $.each($.md.gimmicks, function(i, module) {
            if (module.load === undefined) {
                return;
            }
            $.md.stage('load').subscribe(function(done) {
                module.load();
                done();
            });
        });

        $.md.stage('ready').subscribe(function(done) {
            $.md('createBasicSkeleton');
            done();
        });

        $.md.stage('skel_ready').subscribe(function(done) {
            $.mdbootstrap('init');
            $.mdbootstrap('bootstrapify');
            done();
        });
        $.md.stage('bootstrap').subscribe(function(done){
            processPageLinks($('#md-content'), $.md.baseUrl);
            done();
        });
        $.md.stage('gimmick').subscribe(function(done) {
            $.md.runLinkGimmicks();
            done();
        });

        runStages();

    }

    function runStages() {

        // wire the stages up
        $.md.stage('init').done(function() {
            $.md.stage('load').run();
        });
        $.md.stage('load').done(function() {
            $.md.stage('transform').run();
        });
        $.md.stage('transform').done(function() {
            $.md.stage('ready').run();
        });
        $.md.stage('ready').done(function() {
            $.md.stage('skel_ready').run();
        });
        $.md.stage('skel_ready').done(function() {
            $.md.stage('bootstrap').run();
        });
        $.md.stage('bootstrap').done(function() {
            $.md.stage('pregimmick').run();
        });
        $.md.stage('pregimmick').done(function() {
            $.md.stage('gimmick').run();
        });
        $.md.stage('gimmick').done(function() {
            $.md.stage('postgimmick').run();
        });
        $.md.stage('postgimmick').done(function() {
            $.md.stage('all_ready').run();
        });
        $.md.stage('all_ready').done(function() {
            // reset the stages for next iteration
            resetStages();
        });

        // trigger the whole process by runing the init stage
        $.md.stage('init').run();
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
