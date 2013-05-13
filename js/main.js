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
        // TODO remove events, use stages instead?
    var events = [];
    var hookableEvents = new Array (
        'md_init',
        'md_load',
        'md_ready',
        'md_theme_complete',
        'md_gimmicks_complete',
        'md_complete'
    );

    $.md.stages = {
        'md_init': $.Deferred(),
        'md_load': $.Deferred(),
        'md_ready': $.Deferred(),
        'basic_skeleton_ready': $.Deferred(),
        'bootstrap_skeleton_ready': $.Deferred(),
        'postprocessing': $.Defered,
        'all_ready': $.Defered
    };

    // TODO check if we can remove this
    // simple wrapper around $().bind
    $.md.bind = function(ev, func) {

        if ($.inArray (ev, hookableEvents) === -1) {
            $.error ('Event ' + ev + ' not available');
            return;
        }
        $(document).bind(ev, func);
        // keep track of pushed events
        events.push(ev);
    };
    $.md.trigger = function (ev) {
        if ($.inArray (ev, hookableEvents) === -1) {
            $.error('Event ' + ev + ' not available, can not trigger');
            return;
        }
        $(document).trigger(ev);
    };

    var publicMethods = {
        init: function() {
            bootUp();
            runStages();
        }
    };
    $.md.publicMethods = $.extend ({}, $.md.publicMethods, publicMethods);


    function fetchMainMarkdown(href) {
        var dfd = $.Deferred();
        $.ajax(href).done(function(data) {
            dfd.resolve(data);
        });
        return dfd;
    }
    function transformMarkdown(markdown) {
        var options = {
            gfm: true,
            tables: true,
            breaks: true
        };
        marked.setOptions(options);

        // get sample markdown
        var uglyHtml = marked(markdown);
        return uglyHtml;
    }
    function fetchConfig() {
        var dfdConfig = $.Deferred();
        $.ajax('config.json').done(function(data){
            var configObject = $.parseJSON(data);
            dfdConfig.resolve(configObject);
        }).fail(function() {
            dfdConfig.resolve({});
        });
        return dfdConfig;
    }

    // assemble a navigation
    function insertNavLinks(config) {
        var nav = $.md.config.Navigation;
        for(var i=0;i<nav.length; i++) {
            var anchor = $('<a/>');
            anchor.attr('href', nav[i].Href);
            anchor.text(nav[i].Text);
            anchor.appendTo('#md-menu');
        }
    }

    function isRelativeUrl(url) {
        // if there is :// in it, its considered absolute
        // else its relative
        if (url.indexOf("://") === -1) {
            return true;
        } else {
            return false;
        }
    }
    // modify internal links so we load them through our engine
    function processPageLinks(domElement) {
        var html = $(domElement);
        html.find('a').each(function(i,e) {
            var link = $(e);
            // link must be jquery collection
            var href = link.attr('href');
            if (isRelativeUrl(href) && false) {
                var newHref = '#' + href;
                link.attr('href', newHref);
                link.click(function() {
                    loadContent(href);
                });
            }
        });
    }

    function createMainContent(markdown) {
        var uglyHtml = transformMarkdown(markdown);
        $('#md-content').html(uglyHtml);
        return uglyHtml;
    }
    $.md.config = {};
    $.md.mainHref = '';

    function bootUp() {

        var dfdConfig = fetchConfig();
        var dfdMarkdown = $.Deferred();

        if (window.location.hash) {
            $.md.mainHref = window.location.hash.substring(1);
            dfdMarkdown = fetchMainMarkdown($.md.mainHref);
        }
        else {
            dfdMarkdown.reject();
        }

        $.when(dfdConfig, dfdMarkdown).done(function(config, markdown) {
            if (config) {
                $.md.config = config;
            }
            $.md.stages.md_init.resolve(markdown);
        });

        $.when($.md.stages.md_ready).done(function(config, markdown) {
        });

        $.when($.md.stages.basic_skeleton_ready).done(function (){
        });
        $.when($.md.stages.bootstrap_skeleton_ready).done (function() {
        });

    }
    function clearContent() {
        $("#md-all").empty();
        var skel ='<div id="md-body"><div id="md-title"></div><div id="md-menu">'+
            '</div><div id="md-content"></div></div>';
        $("#md-all").prepend($(skel));
    }
    function loadContent(href) {
        // after all done, we reset the deferred's for the next
        // iteration
        $.md.stages.md_init = $.Deferred();
        $.md.stages.md_load = $.Deferred();
        $.md.stages.md_ready = $.Deferred();
        $.md.stages.basic_skeleton_ready = $.Deferred();
        $.md.stages.bootstrap_skeleton_ready = $.Deferred();
        $.md.stages.postprocessing = $.Deferred();
        $.md.stages.all_ready = $.Deferred();

        $.md.mainHref = href;
        var dfdMarkdown = fetchMainMarkdown($.md.mainHref);

        runStages();

        $.when(dfdMarkdown).done(function(markdown) {
            clearContent();
            $.md.stages.md_load.resolve(markdown);
        });

    }
    function runStages() {

        // md_load stage start
        $.when($.md.stages.md_init).done(function(markdown) {
            $.md.stages.md_load.resolve(markdown);
        });
        // md_load stage done

        // md_ready stage start
        $.md.stages.md_load.done(function(markdown) {
            createMainContent(markdown);
            $.md.stages.md_ready.resolve();
        });
        // md_ready stage end

        // basic_skeleton_ready stage start
        $.md.stages.md_ready.done(function(){
            if ($.md.config.Navigation) {
                insertNavLinks($.md.config);
            }
            $.md('createBasicSkeleton');
            $.md.stages.basic_skeleton_ready.resolve();
        });
        // basic_skeleton_ready stage end

        $.md.stages.basic_skeleton_ready.done(function(){
            $.mdbootstrap('bootstrapify');
            $.mdbootstrap('init');
            $.md.stages.bootstrap_skeleton_ready.resolve();
        });

        $.md.stages.bootstrap_skeleton_ready.done(function(){
            processPageLinks($('#md-menu'));
            processPageLinks($('#md-content'));
        });
    }
    $(document).ready(function () {
        $.md('init');
    });
}(jQuery));
