(function($) {
    'use strict';

    // PUBLIC API
    $.md.registerGimmick = function(module) {
        $.md.gimmicks.push(module);
        return;
    };

    // registers a script for a gimmick, that is later dynamically loaded
    // by the core.
    // src may be an URL or direct javascript sourcecode. When options.callback
    // is provided, the done() function is passed to the function and needs to
    // be called.
    $.md.registerScript = function(module, src, options) {
        var scriptinfo = new ScriptInfo({
            module: module,
            src: src,
            options: options
        });
        registeredScripts.push(scriptinfo);
    };

    // same as registerScript but for css. Note that we do not provide a
    // callback when the load finishes
    $.md.registerCss = function(module, url, options) {
        var license = options.license,
            stage = options.stage || 'skel_ready',
            callback = options.callback;

        checkLicense(license, module);
        var tag = '<link rel="stylesheet" href="' + url + '" type="text/css"></link>';
        $.md.stage(stage).subscribe(function(done) {
            $('head').append(tag);
            if (callback !== undefined) {
                callback(done);
            } else {
                done();
            }
        });
    };

    // turns hostname/path links into http://hostname/path links
    // we need to do this because if accessed by file:///, we need a different
    // transport scheme for external resources (like http://)
    $.md.prepareLink = function(link, options) {
        options = options || {};
        var ownProtocol = window.location.protocol;

        if (options.forceSSL)
            return 'https://' + link;
        if (options.forceHTTP)
            return 'http://' + link;

        if (ownProtocol === 'file:') {
            return 'http://' + link;
        }
        // default: use the same as origin resource
        return '//' + link;
    };

    // associate a link trigger for a gimmick. i.e. [gimmick:foo]() then
    // foo is the trigger and will invoke the corresponding gimmick
    $.md.linkGimmick = function(module, trigger, callback, stage) {
        if (stage === undefined) {
            stage = 'gimmick';
        }
        var linktrigger = new LinkTrigger({
            trigger: trigger,
            module: module,
            stage: stage,
            callback: callback
        });
        linkTriggers.push(linktrigger);
    };

    $.md.triggerIsActive = function(trigger) {
        if (activeLinkTriggers.indexOf(trigger) === -1) {
            return false;
        } else {
            return true;
        }
    };

    var initialized = false;
    // TODO combine main.js and modules.js closure
    $.md.initializeGimmicks = function() {
        findActiveLinkTrigger();
        runGimmicksOnce();
        loadRequiredScripts();
    };

    // END PUBLIC API


    var log = $.md.getLogger();

    // triggers that we actually found on the page
    // array of string
    var activeLinkTriggers = [];


    // array of ScriptInfo
    var registeredScripts = [];
    function ScriptInfo(initial) {
        this.module = undefined;
        this.options = {};

        // can ba an URL or javascript sourcecode
        this.src = '';

        $.extend(this, initial);
    }

    // array of linkTriggers
    var linkTriggers = [];
    function LinkTrigger(initial) {
        this.trigger = undefined;
        this.module = undefined;
        this.callback = undefined;

        $.extend(this, initial);
    }

    // jQuery does some magic when inserting inline scripts, so better
    // use vanilla JS. See:
    // http://stackoverflow.com/questions/610995/jquery-cant-append-script-element
    function insertInlineScript(src) {
        // scripts always need to go directly into the DOM
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = src;
        document.body.appendChild(script);
    }

    // since we are GPL, we have to be cautious what other scripts we load
    // as delivering to the browser is considered delivering a derived work
    var licenses = ['MIT', 'BSD', 'GPL', 'GPL2', 'GPL3', 'LGPL', 'LGPL2',
        'APACHE2', 'PUBLICDOMAIN', 'EXCEPTION', 'OTHER'
    ];
    function checkLicense(license, module) {
        if ($.inArray(license, licenses) === -1) {
            var availLicenses = JSON.stringify(licenses);
            log.warn('license ' + license + ' is not known.');
            log.warn('Known licenses:' + availLicenses);

        } else if (license === 'OTHER') {
            log.warn('WARNING: Module ' + module.name + ' uses a script'+
                ' with unknown license. This may be a GPL license violation if'+
                ' this website is publically available!');
        }
    }

    // will actually schedule the script load into the DOM.
    function loadScript(scriptinfo) {

        var module = scriptinfo.module,
            src = scriptinfo.src,
            options = scriptinfo.options;

        var license = options.license || 'OTHER',
            loadstage = options.loadstage || 'skel_ready',
            finishstage = options.finishstage || 'pregimmick',
            callback = options.callback;

        var loadDone = $.Deferred();

        checkLicense(license, module);
        // start script loading
        log.debug('subscribing ' + module.name + ' to start: ' + loadstage + ' end in: ' + finishstage);
        $.md.stage(loadstage).subscribe(function(done) {
            if (src.startsWith('//') || src.startsWith('http')) {
                $.getScript(src, function() {
                    if (callback !== undefined) {
                        callback(done);
                    } else {
                        log.debug('module' + module.name + ' script load done: ' + src);
                        done();
                    }
                    loadDone.resolve();
                });
            } else {
                // inline script that we directly insert
                insertInlineScript(src);
                log.debug('module' + module.name + ' script inject done');
                loadDone.resolve();
                done();
            }
        });
        // if loading is not yet finished in stage finishstage, wait
        // for the loading to complete
        $.md.stage(finishstage).subscribe(function(done) {
            loadDone.done(function() {
                done();
            });
        });
    }

    // finds out that kind of trigger words are acutally used on a given page
    // this is most likely a very small subset of all available gimmicks
    function findActiveLinkTrigger() {
        var $gimmicks = $('a:icontains(gimmick:)');
        $gimmicks.each(function(i,e) {
            var parts = getGimmickLinkParts($(e));
            if (activeLinkTriggers.indexOf(parts.trigger) === -1) {
                activeLinkTriggers.push(parts.trigger);
            }
        });
        log.debug('Scanning for required gimmick links: ' + JSON.stringify(activeLinkTriggers));
    }

    function loadRequiredScripts() {
        // find each module responsible for the link trigger
        $.each(activeLinkTriggers, function(i,trigger) {
            var module = findModuleByTrigger(trigger);
            if (module === undefined) {
                log.error('Gimmick link: "' + trigger + '" found but no suitable gimmick loaded');
                return;
            }
            var scriptinfo = registeredScripts.filter(function(info) {
                return info.module.name === module.name;
            })[0];
            // register to load the script
            if (scriptinfo !== undefined) {
                loadScript(scriptinfo);
            }
        });
    }

    function findModuleByTrigger(trigger) {
        var ret;
        $.each(linkTriggers, function(i,e) {
            if (e.trigger === trigger) {
                ret = e.module;
            }
        });
        return ret;
    }

    function getGimmickLinkParts($link) {
        var link_text = $.trim($link.toptext());
        // returns linkTrigger, options, linkText
        if (link_text.match(/gimmick:/i) === null) {
            return null;
        }
        var href = $.trim($link.attr('href'));
        var r = new RegExp(/gimmick:\s*([^(\s]*)\s*(\(\s*{?(.*)\s*}?\s*\))*/i);
        var matches = r.exec(link_text);
        if (matches === null || matches[1] === undefined) {
            $.error('Error matching a gimmick: ' + link_text);
            return null;
        }
        var trigger = matches[1].toLowerCase();
        var args = null;
        // getting the parameters
        if (matches[2] !== undefined) {
            // remove whitespaces
            var params = $.trim(matches[3].toString());
            // remove the closing } if present
            if (params.charAt (params.length - 1) === '}') {
                params = params.substring(0, params.length - 1);
            }
            // add surrounding braces and paranthese
            params = '({' + params + '})';
            // replace any single quotes by double quotes
            params = params.replace(/'/g, '"');
            // finally, try if the json object is valid
            try {
                /*jshint -W061 */
                args = eval(params);
            } catch (err) {
                log.error('error parsing argument of gimmick: ' + link_text + 'giving error: ' + err);
            }
        }
        return { trigger: trigger, options: args, href: href };
    }

    function runGimmicksOnce() {
        // runs the once: callback for each gimmick within the init stage
        $.each($.md.gimmicks, function(i, module) {
            if (module.once === undefined) {
                return;
            }
            module.once();
        });
    }

    // activate all gimmicks on a page, that are contain the text gimmick:
    // TODO make private / merge closures
    $.md.registerLinkGimmicks = function () {
        var $gimmick_links = $('a:icontains(gimmick:)');
        $gimmick_links.each(function(i, e) {
            var $link = $(e);
            var gimmick_arguments = getGimmickLinkParts($link);

            $.each(linkTriggers, function(i, linktrigger) {
                if (gimmick_arguments.trigger === linktrigger.trigger) {
                    subscribeLinkTrigger($link, gimmick_arguments, linktrigger);
                }
            });
        });
    };

    function subscribeLinkTrigger($link, args, linktrigger) {
        log.debug('Subscribing gimmick ' + linktrigger.module.name + ' to stage: ' + linktrigger.stage);

        $.md.stage(linktrigger.stage).subscribe(function(done) {
            args.options = args.options ||{};

            // it is possible that broken modules or any other transformation removed the $link
            // from the dom in the meantime
            if (!jQuery.contains(document.documentElement, $link[0])) {
                log.error ('LINK IS NOT IN THE DOM ANYMORE: ');
                console.log($link);
            }

            log.debug('Running gimmick ' + linktrigger.module.name);
            linktrigger.callback($link, args.options, args.href, done);

            // if the gimmick didn't call done, we trigger it here
            done();
        });
    }
}(jQuery));
