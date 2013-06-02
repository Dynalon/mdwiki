(function($) {
    'use strict';

    var log = $.md.getLogger();

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

        $.md.stage('init').subscribe(function(done) {
            $.ajax($.md.mainHref).done(function(data) {
                // TODO do this elsewhere
                md = data;
                done();
            }).fail(function() {
                var log = $.md.getLogger();
                log.fatal('Could not get ' + $.md.mainHref);
                done();
            });
        });

        $.md.stage('transform').subscribe(function(done) {
            var len = $.md.mainHref.lastIndexOf('/');
            var baseUrl = $.md.mainHref.substring(0, len+1);
            $.md.baseUrl = baseUrl;
            done();
        });

        $.md.stage('ready').subscribe(function(done) {
            var uglyHtml = transformMarkdown(md);
            $('#md-content').html(uglyHtml);
            md = '';
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

    var navMD = '';
    $.md.NavgiationDfd = $.Deferred();
    $.ajax('navigation.md').done(function(data) {
        navMD = data;
        $.md.NavgiationDfd.resolve();
    }).fail(function() {
        $.md.NavgiationDfd.reject();
    });

    function registerBuildNavigation() {

        $.md.stage('init').subscribe(function(done) {
            //$.ajax('navigation.md')
            $.md.NavgiationDfd.done(function() {
                done();
            })
            .fail(function() {
                done();
            });
        });

        $.md.stage('transform').subscribe(function(done) {
            if (navMD === '') {
                var log = $.md.getLogger();
                log.info('no navgiation.md found, not using a navbar');
                done();
                return;
            }

            var navHtml = marked(navMD);
            var h = $('<div>' + navHtml + '</div>');
            h.find('p').each(function(i,e) {
                var el = $(e);
                el.replaceWith(el.html());
            });
            $('#md-menu').append(h.html());
            done();
        });

        $.md.stage('bootstrap').subscribe(function(done) {
            processPageLinks($('#md-menu'));
            done();
        });

    }

    $.md.ConfigDfd = $.Deferred();
    $.ajax('config.json').done(function(data) {
        try {
            $.md.config = $.parseJSON(data);
        } catch(err) {
            log.error('config.json was not JSON parsable: ' + err);
        }
        log.info('Found a valid config.json file, using configuration');
        $.md.ConfigDfd.resolve();
    }).fail(function() {
        $.md.ConfigDfd.reject();
    });
    function registerFetchConfig() {

        $.md.stage('init').subscribe(function(done) {
            // TODO 404 won't get cached, requesting it every reload is not good
            // maybe use cookies? or disable re-loading of the page
            //$.ajax('config.json').done(function(data){
            $.md.ConfigDfd.done(function(){
                done();
            }).fail(function() {
                var log = $.md.getLogger();
                log.info('No config.json found, using default settings');
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

        registerFetchMarkdown();
        registerClearContent();

        // find out which link gimmicks we need
        $.md.stage('ready').subscribe(function(done) {
            $.md.initializeGimmicks();
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
            $('html').removeClass('md-hidden-load');
            // reset the stages for next iteration
            resetStages();
        });

        // trigger the whole process by runing the init stage
        $.md.stage('init').run();
        return;
    }

    function extractHashData() {
        // first char is the #
        var href = window.location.hash.substring(1);

        // extract possible in-page anchor
        var ex_pos = href.indexOf('!');
        if (ex_pos !== -1) {
            $.md.inPageAnchor = href.substring(ex_pos + 1);
            $.md.mainHref = href.substring(0, ex_pos);
        } else {
            $.md.mainHref = href;
        }
    }

    $(document).ready(function () {

        // stage init stuff
        registerFetchConfig();
        registerBuildNavigation();
        extractHashData();

        if (window.location.hash === '') {
            window.location.hash = '#index.md';
        }

        $(window).bind('hashchange', function () {
            window.location.reload(false);
        });

        loadContent($.md.mainHref);
    });
}(jQuery));
