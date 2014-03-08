declare var $: any;
declare var RegExp: any;

module MDwiki.Gimmicks {
    export interface IExternalResource {
        url: string
    }

    export interface IScriptResource extends IExternalResource {
        loadstage: string;
    }

    export interface IStyleResource extends IExternalResource {
    }

    export class ScriptResource implements IScriptResource {
        constructor
        (
            public url: string,
            public loadstage: string = 'gimmick'
        ) { }
    }

    class StyleResource implements IStyleResource {
        constructor
        (
            public url: string
        ) { }
    }

    export interface ILinkGimmick {
        trigger: string;
        scripts: IScriptResource[];
        styles: IStyleResource[];
        init: () => void;
        loadAll: ($links: any) => void;
        load: ($link: any, options: any, text: string) => void;
        ready: () => void;
    }

    export class LinkGimmick implements ILinkGimmick {
        trigger: string;
        scripts: IScriptResource[];
        styles: IStyleResource[];

        init() { }
        loadAll($links: any) { }
        load($link: any, options: any, text: string) { }
        ready() { }

        static getGimmickLinkParts($link: any) {
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
                    // TODO log.error('error parsing argument of gimmick: ' + link_text + 'giving error: ' + err);
                }
            }
            return { trigger: trigger, options: args, href: href };
        }
    }

    export interface Gimmick {
        name: string;
        scripts: IScriptResource[];
        styles: IStyleResource[];
    }

    class BasicGimmick {
        public name: string;
        constructor() {

        }
    }

    class MathJaxGimmick implements ILinkGimmick {
        trigger: string = 'forkmeongithub';
        scripts: IScriptResource[] = [];
        styles: IStyleResource[] = [];

        constructor() {
        }

        init() {
            // TODO auto-link parsing
            var href = $.md.prepareLink('cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', { forceHTTP: true });
            var s = new ScriptResource(href, 'gimmick');
            this.scripts.push(s);
        }
        load($link: any, options: any, text: string) { }
        loadAll($links) { }
        ready() { }
    }

    export class HelloWorldGimmick implements ILinkGimmick {
        trigger: string = 'hello';
        scripts: IScriptResource[] = [];
        styles: IStyleResource[] = [];

        init() {
            alert("init");
        }
        load($link: any, options: any, text: string) {
            alert(text);
        }
        loadAll($links) { }
        ready() { }
    }

    // function mg (){
    //     var scripts = [];

    //     registerGimmick({
    //         'trigger': 'math',
    //         init: function () {
    //             var href = $.md.prepareLink('cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', { forceHTTP: true });
    //             var s = new Script(href, 'gimmick');
    //             scripts.push(s);
    //         }
    //     });
    // }

    export class GimmickLoader {
        // all available gimmicks
        private registeredLinkGimmicks: ILinkGimmick[] = [];
        // all really required (existing on page) gimmicks
        private requiredLinkGimmicks: ILinkGimmick[] = [];

        constructor() {
        }

        init() {
            return;

        }

        register(gmck: Gimmick) {
            return;
        }
        // called from where?
        registerLinkGimmick(gmck: ILinkGimmick) {
           this.registeredLinkGimmicks.push(gmck);
        }

        // called where?
        initLinkGimmicks() {
            // find all used gimmick: links in page
            var used_triggers = this.findActiveLinkTrigger();

            // TODO debug log all triggers that we don't have
            // a gimmick for

            // TODO this is nutds - underscore.js?
            this.requiredLinkGimmicks = this.registeredLinkGimmicks.filter (lgmck => {
                return used_triggers.indexOf(lgmck.trigger) > 0;
            });

            this.requiredLinkGimmicks.map(gmck => {
                // TODO add script register to be loaded
                gmck.init();
            });
        }
        loadLinkGimmicks() {
        }

        private findActiveLinkTrigger() {
            // log.debug('Scanning for required gimmick links: ' + JSON.stringify(activeLinkTriggers));
            var activeLinkTriggers = [];

            var $gimmicks = $('a:icontains(gimmick:)');
            $gimmicks.each((i,e) => {
                var parts = LinkGimmick.getGimmickLinkParts($(e));
                if (activeLinkTriggers.indexOf(parts.trigger) === -1)
                    activeLinkTriggers.push(parts.trigger);
            });
            return activeLinkTriggers;
        }
    }
}
