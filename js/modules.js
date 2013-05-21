(function($) {
    'use strict';
    var licenses = ['MIT', 'BSD', 'GPL', 'GPL2', 'GPL3', 'LGPL', 'LGPL2',
        'APACHE2', 'PUBLICDOMAIN', 'OTHER'
    ];
    var registeredScripts = [];
    var linkTriggers = [];
    // triggers that we actually found on the page
    var activeLinkTriggers = [];

    function ScriptInfo(initial) {
        this.module = undefined;
        this.options = {};
        this.url = '';

        $.extend(this, initial);
    }
    function LinkTrigger(initial) {
        this.trigger = undefined;
        this.module = undefined;
        this.callback = undefined;

        $.extend(this, initial);
    }


    function checkLicense(license, modulename) {
        if ($.inArray(license, licenses) === -1) {
            var availLicenses = JSON.stringify(licenses);
            console.log('license ' + license + ' is not known.');
            console.log('Known licenses:' + availLicenses);

        } else if (license === 'OTHER') {
            console.log('WARNING: Module ' + modulename + ' uses a script'+
                ' with unknown license. This may be a GPL license violation if'+
                ' this website is publically available!');
        }
    }


    $.md.registerScript = function(module, url, options) {
        var scriptinfo = new ScriptInfo({
            module: module,
            url: url,
            options: options
        });
        registeredScripts.push(scriptinfo);
    };

    function loadScript(scriptinfo) {

        var module = scriptinfo.module,
            url = scriptinfo.url,
            options = scriptinfo.options;
        console.log(options);

        var license = options.license || 'OTHER',
            loadstage = options.loadstage || 'skel_ready',
            finishstage = options.finishstage || 'pregimmick',
            callback = options.callback;

        var loadDone = $.Deferred();

        checkLicense(license);
        // start script loading
        console.log ('subscribing ' + module.name + 'to start: ' + loadstage + ' end in: ' + finishstage);
        $.md.stage(loadstage).subscribe(function(done) {
            if (url.startsWith('//') || url.startsWith('http')) {
                $.getScript(url, function() {
                    if (callback !== undefined) {
                        callback(done);
                    } else {
                        console.log('script load done: ' + url);
                        done();
                    }
                    loadDone.resolve();
                });
            } else {
                // inline script that we directly insert
                $('body').append($(url));
                console.log('script inject done: ' + url);
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

    $.md.loadCss = function(module, url, options) {
        var license = options.license,
            stage = options.stage || 'skel_ready',
            callback = options.callback;

        checkLicense(license);
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

    $.md.linkGimmick = function(module, name, callback) {
        var linktrigger = new LinkTrigger({
            trigger: name,
            module: module,
            callback: callback
        });
        linkTriggers.push(linktrigger);
    };

    $.md.findActiveLinkTrigger = function() {
        var $gimmicks = $('a:icontains(gimmick:)');
        $gimmicks.each(function(i,e) {
            var parts = getGimmickLinkParts($(e));
            if (activeLinkTriggers.indexOf(parts.trigger) === -1) {
                activeLinkTriggers.push(parts.trigger);
            }
        });
        console.log('We need the modules: ' + JSON.stringify(activeLinkTriggers));
    };

    $.md.loadRequiredScripts = function() {
        // TODO
        // find each module responsible for the link trigger
        // register to load the script
        $.each(activeLinkTriggers, function(i,trigger) {
            var module = findModuleByTrigger(trigger);
            if (module === undefined) {
                console.log('Gimmick link: "' + trigger + '" not registered by any module');
                return;
            }
            var scriptinfo = registeredScripts.filter(function(info) {
                return info.module.name === module.name;
            })[0];
            if (scriptinfo !== undefined) {
                loadScript(scriptinfo);
            }
        });
    };

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
        var link_text = $.trim($link.text());
        // returns linkTrigger, options, linkText
        if (link_text.match(/gimmick:/i) === null) {
            return null;
        }
        var r = new RegExp(/gimmick:\s*([^(\s]*)\s*(\(\s*{?(.*)\s*}?\s*\))*/i);
        var matches = r.exec(link_text);
        if (matches === null || matches[1] === undefined) {
            $.error('Error matching a gimmick: ' + link_text);
            return null;
        }
        var trigger = matches[1].toLowerCase();
        var args = null;
        // getting the parameters
        if (matches[3] !== undefined) {
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
                $.error('error parsing argument of gimmick: ' + link_text + 'giving error: ' + err);
            }
        }
        return { trigger: trigger, options: args, text: link_text };
    }


    $.md.runGimmicksOnce = function() {
        // runs the once: callback for each gimmick within the init stage
        $.each($.md.gimmicks, function(i, module) {
            if (module.once === undefined) {
                return;
            }
            module.once();
        });
    };

    // activate all gimmicks on a page, that are contain the text gimmick:
    $.md.runLinkGimmicks = function() {
        var $gimmicks = $('a:icontains(gimmick:)');
        $gimmicks.each(function() {
            var $link = $(this);
            var args = getGimmickLinkParts($link);
            $.each(linkTriggers, function(i,e) {
                if (args.trigger === e.trigger) {
                    e.callback($link, args.options, args.text);
                }
            });
        });
    };

    $.md.registerGimmick = function(module) {
        $.md.gimmicks.push(module);
        return;
    };
}(jQuery));
