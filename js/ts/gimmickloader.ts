declare var $: any;

module MDwiki.Core {
    export interface IExternalResource {
        url: string
    }

    export interface IScriptResource extends IExternalResource {
        loadstage: string;
    }

    export class ScriptResource implements IScriptResource {
        constructor
        (
            public url: string,
            public loadstage: string = 'gimmick'
        ) { }
    }

    export interface ICssResource extends IExternalResource {
    }
    export class CssResource implements ICssResource {
        constructor
        (
            public url: string
        ) { }
    }

    export interface IGimmick {
        name: string;
        // if it is a link gimmick trigger != null
        trigger?: string;
        scripts: IScriptResource[];
        styles: ICssResource[];
        init: () => void;
        load: ($link: any, options: any, text: string) => void;
        ready: () => void;
    }

    function getGimmickLinkParts($link: any) {
        var link_text = $.trim($link.toptext());
        // returns linkTrigger, options, linkText
        if (link_text.match(/gimmick:/i) === null) {
            return null;
        }
        var href = $.trim($link.attr('href'));
        var r = new RegExp('gimmick:\s*([^(\s]*)\s*((\s*{?(.*)\s*}?\s*\))*','i');
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
            // TODO this should be enabled?
            // params = '({' + params + '})';

            // replace any single quotes by double quotes
            var replace_quotes = new RegExp ("'", 'g');
            params = params.replace (replace_quotes, '"');
            // finally, try if the json object is valid
            try {
                /*jshint -W061 */
                args = eval(params);
            } catch (err) {
                $.error('error parsing argument of gimmick: ' + link_text + 'giving error: ' + err);
            }
        }
        return new GimmickLinkParts (trigger, args, href);
    }

    // [gimmick:trigger({option1: value1, option2:value2})](href)
    class GimmickLinkParts {
        constructor (
            public trigger:string,
            public options: any,
            public href: string
        ) { }
    }

    class MathJaxGimmick implements IGimmick {
        name: string = 'mathjax';
        trigger: string = 'math';
        scripts: IScriptResource[] = [];
        styles: ICssResource[] = [];

        constructor() {
        }

        init() {
            // TODO auto-link parsing
            var href = $.md.prepareLink('cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', { forceHTTP: true });
            var s = new ScriptResource(href, 'gimmick');
            this.scripts.push(s);
        }
        load($link: any, options: any, text: string) { }
        ready() { }
    }

    export class HelloWorldGimmick implements IGimmick {
        trigger: string = 'hello';
        name: string = 'Hello World Gimmick';
        scripts: IScriptResource[] = [];
        styles: ICssResource[] = [];

        init() {
            alert("init");
        }
        load($link: any, options: any, text: string) {
            alert(text);
        }
        loadAll($links) { }
        ready() { }
    }

    export class GimmickLoader {
        // all available gimmicks
        private registeredGimmicks: IGimmick[] = [];
        // all really required (existing on page) gimmicks
        private requiredGimmicks: IGimmick[] = [];

        constructor() {
        }

        init() {
            return;
        }

        register(gmck: IGimmick) {
           this.registeredGimmicks.push(gmck);
        }

        initGimmicks() {
            // find all used gimmick: links in page
            var used_triggers = this.findActiveLinkTrigger();

            this.requiredGimmicks = this.registeredGimmicks.filter (lgmck => {
                return used_triggers.indexOf(lgmck.trigger) >= 0;
            });
            // load  deps

            this.requiredGimmicks.map(gmck => {
                gmck.init();
            });
        }

        loadGimmicks() {
            var $gimmick_links = $('a:icontains(gimmick:)');
            $gimmick_links.map((i,e) => {
                var $link = $(e);
                var parts = getGimmickLinkParts($link);
                var gimmick_impl = this.requiredGimmicks.filter (n => n.trigger == parts.trigger)[0];

                gimmick_impl.load ($link, parts.options, parts.trigger);
            });
        }

        private findActiveLinkTrigger() {
            // log.debug('Scanning for required gimmick links: ' + JSON.stringify(activeLinkTriggers));
            var activeLinkTriggers = [];

            var $gimmicks = $('a:icontains(gimmick:)');
            $gimmicks.each((i,e) => {
                var parts = getGimmickLinkParts($(e));
                if (activeLinkTriggers.indexOf(parts.trigger) === -1)
                    activeLinkTriggers.push(parts.trigger);
            });
            return activeLinkTriggers;
        }
    }
}
