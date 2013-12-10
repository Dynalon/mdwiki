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

            $.Stage('all_ready'),

            // used for integration tests, not intended to use in MDwiki itself
            $.Stage('final_tests')
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

    function transformMarkdown (markdown) {
        var options = {
            gfm: true,
            tables: true,
            breaks: true
        };
        if ($.md.config.lineBreaks === 'original')
            options.breaks = false;
        else if ($.md.config.lineBreaks === 'gfm')
            options.breaks = true;

        marked.setOptions(options);

        // get sample markdown
        var uglyHtml = marked(markdown);
        return uglyHtml;
    }

    function registerFetchMarkdown() {

        var md = '';

        $.md.stage('init').subscribe(function(done) {
            var ajaxReq = {
                url: $.md.mainHref,
                dataType: 'text'
            };
            $.ajax(ajaxReq).done(function(data) {
                // TODO do this elsewhere
                md = data;
                done();
            }).fail(function() {
                var log = $.md.getLogger();
                log.fatal('Could not get ' + $.md.mainHref);
                done();
            });
        });

        // find baseUrl
        $.md.stage('transform').subscribe(function(done) {
            var len = $.md.mainHref.lastIndexOf('/');
            var baseUrl = $.md.mainHref.substring(0, len+1);
            $.md.baseUrl = baseUrl;
            done();
        });

        $.md.stage('transform').subscribe(function(done) {
            var uglyHtml = transformMarkdown(md);
            $('#md-content').html(uglyHtml);
            md = '';
            var dfd = $.Deferred();
            loadExternalIncludes(dfd);
            dfd.always(function () {
                done();
            });
        });
    }

    // load [include](/foo/bar.md) external links
    function loadExternalIncludes(parent_dfd) {

        function findExternalIncludes () {
            return $('a').filter (function () {
                var href = $(this).attr('href');
                var text = $(this).toptext();
                var isMarkdown = $.md.util.hasMarkdownFileExtension(href);
                var isInclude = text === 'include';
                var isPreview = text.startsWith('preview:');
                return (isInclude || isPreview) && isMarkdown;
            });
        }

        function selectPreviewElements ($jqcol, num_elements) {
            function isTextNode(node) {
                return node.nodeType === 3;
            }
            var count = 0;
            var elements = [];
            $jqcol.each(function (i,e) {
                if (count < num_elements) {
                    elements.push(e);
                    if (!isTextNode(e)) count++;
                }
            });
            return $(elements);
        }

        var external_links = findExternalIncludes ();
        // continue execution when all external resources are fully loaded
        var latch = $.md.util.countDownLatch (external_links.length);
        latch.always (function () {
            parent_dfd.resolve();
        });

        external_links.each(function (i,e) {
            var $el = $(e);
            var href = $el.attr('href');
            var text = $el.toptext();

            $.ajax({
                url: href,
                dataType: 'text'
            })
            .done(function (data) {
                var $html = $(transformMarkdown(data));
                if (text.startsWith('preview:')) {
                    // only insert the selected number of paragraphs; default 3
                    var num_preview_elements = parseInt(text.substring(8), 10) ||3;
                    var $preview = selectPreviewElements ($html, num_preview_elements);
                    $preview.last().append('<a href="' + href +'"> ...read more &#10140;</a>');
                    $preview.insertBefore($el.parent('p').eq(0));
                    $el.remove();
                } else {
                    $html.insertAfter($el.parents('p'));
                    $el.remove();
                }
            }).always(function () {
                latch.countDown();
            });
        });
    }

    function isSpecialLink(href) {
        if (!href) return false;

        if (href.lastIndexOf('data:') >= 0)
            return true;

        if (href.startsWith('mailto:'))
            return true;

        if (href.startsWith('file:'))
            return true;

        if (href.startsWith('ftp:'))
            return true;

        // TODO capture more special links: every non-http link with : like
        // torrent:// etc.
    }

    // modify internal links so we load them through our engine
    function processPageLinks(domElement, baseUrl) {
        var html = $(domElement);
        if (baseUrl === undefined) {
            baseUrl = '';
        }
        // HACK against marked: empty links will have empy href attribute
        // we remove the href attribute from the a tag
        html.find('a').not('#md-menu a').filter(function () {
            var $this = $(this);
            var attr = $this.attr('href');
            if (!attr || attr.length === 0)
                $this.removeAttr('href');
        });

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

            if (href && href.lastIndexOf ('#!') >= 0)
                return;

            if (isSpecialLink(href))
                return;

            if (!isImage && href.startsWith ('#') && !href.startsWith('#!')) {
                // in-page link
                link.click(function(ev) {
                    ev.preventDefault();
                    $.md.scrollToInPageAnchor (href);
                });
            }

            if (! $.md.util.isRelativeUrl(href))
                return;

            if (isImage && ! $.md.util.isRelativePath(href))
                return;

            if (!isImage && $.md.util.isGimmickLink(link))
                return;

            function build_link (url) {
                if ($.md.util.hasMarkdownFileExtension (url))
                    return '#!' + url;
                else
                    return url;
            }

            var newHref = baseUrl + href;
            if (isImage)
                link.attr(hrefAttribute, newHref);
            else if ($.md.util.isRelativePath (href))
                link.attr(hrefAttribute, build_link(newHref));
            else
                link.attr(hrefAttribute, build_link(href));
        });
    }

    var navMD = '';
    $.md.NavigationDfd = $.Deferred();
    var ajaxReq = {
        url: 'navigation.md',
        dataType: 'text'
    };
    $.ajax(ajaxReq).done(function(data) {
        navMD = data;
        $.md.NavigationDfd.resolve();
    }).fail(function() {
        $.md.NavigationDfd.reject();
    });

    function registerBuildNavigation() {

        $.md.stage('init').subscribe(function(done) {
            $.md.NavigationDfd.done(function() {
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
            // TODO why are <script> tags from navHtml APPENDED to the jqcol?
            var $h = $('<div>' + navHtml + '</div>');

            // insert <scripts> from navigation.md into the DOM
            $h.each(function (i,e) {
                if (e.tagName === 'SCRIPT') {
                    $('script').first().before(e);
                }
            });

            // TODO .html() is evil!!!
            var $navContent = $h.eq(0);
            $navContent.find('p').each(function(i,e) {
                var $el = $(e);
                $el.replaceWith($el.html());
            });
            $('#md-menu').append($navContent.html());
            done();
        });

        $.md.stage('bootstrap').subscribe(function(done) {
            processPageLinks($('#md-menu'));
            done();
        });

        $.md.stage('postgimmick').subscribe(function(done) {
            var num_links = $('#md-menu a').length;
            var has_header = $('#md-menu .navbar-brand').eq(0).toptext().trim().length > 0;
            if (!has_header && num_links <= 1)
                $('#md-menu').hide();

            done();
        });
    }

    $.md.ConfigDfd = $.Deferred();
    $.ajax({url: 'config.json', dataType: 'text'}).done(function(data) {
        try {
            var data_json = JSON.parse(data);
            $.md.config = $.extend($.md.config, data_json);
            log.info('Found a valid config.json file, using configuration');
        } catch(err) {
            log.error('config.json was not JSON parsable: ' + err);
        }
        $.md.ConfigDfd.resolve();
    }).fail(function(err, textStatus) {
        log.error('unable to retrieve config.json: ' + textStatus);
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
            $.md.registerLinkGimmicks();
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

        $.md.stage('bootstrap').subscribe(function(done){
            $.mdbootstrap('bootstrapify');
            processPageLinks($('#md-content'), $.md.baseUrl);
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

            // phantomjs hook when we are done
            if (typeof window.callPhantom === 'function') {
                window.callPhantom({});
            }

            $.md.stage('final_tests').run();
        });
        $.md.stage('final_tests').done(function() {
            // reset the stages for next iteration
            resetStages();

            // required by dalekjs so we can wait the element to appear
            $('body').append('<span id="start-tests"></span>');
            $('#start-tests').hide();
        });

        // trigger the whole process by runing the init stage
        $.md.stage('init').run();
        return;
    }

    function extractHashData() {
        // first char is the # or #!
        var href;
        if (window.location.hash.startsWith('#!')) {
            href = window.location.hash.substring(2);
        } else {
            href = window.location.hash.substring(1);
        }
        href = decodeURIComponent(href);

        // extract possible in-page anchor
        var ex_pos = href.indexOf('#');
        if (ex_pos !== -1) {
            $.md.inPageAnchor = href.substring(ex_pos + 1);
            $.md.mainHref = href.substring(0, ex_pos);
        } else {
            $.md.mainHref = href;
        }
    }

    function appendDefaultFilenameToHash () {
        var newHashString = '';
        var currentHashString = window.location.hash || '';
        if (currentHashString === '' ||
            currentHashString === '#'||
            currentHashString === '#!')
        {
            newHashString = '#!index.md';
        }
        else if (currentHashString.startsWith ('#!') &&
                 currentHashString.endsWith('/')
                ) {
            newHashString = currentHashString + 'index.md';
        }
        if (newHashString)
            window.location.hash = newHashString;
    }

    $(document).ready(function () {

        // stage init stuff
        registerFetchConfig();
        registerBuildNavigation();
        extractHashData();

        appendDefaultFilenameToHash();

        $(window).bind('hashchange', function () {
            window.location.reload(false);
        });

        loadContent($.md.mainHref);
    });
}(jQuery));
