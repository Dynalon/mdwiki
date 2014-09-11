///<reference path="../../typings/tsd.d.ts" />

module MDwiki.Gimmick {

    export class MultilineGimmickReference {
        trigger: string;
        text: string;
        domElement: JQuery;
        options: any;
    }
    export class SinglelineGimmickReference {
        trigger: string;
        href: string;
        domElement: JQuery;
        options: any;
    }

    export interface IMultilineGimmickHandler {
        (trigger: string, content: string, options: any, domElement: any): void;
    }
    export interface ISinglelineGimmickCallback {
        (trigger: string, content: string, options: any, domElement: any): void;
    }

    export class GimmickHandler {
    }

    export class Gimmick {
        name: string;
        handlers: any[] = []
        init () {
        }
        constructor(name: string) {
            this.name = name;
        }
        addHandler(handlerDescription: any) {
            if (!handlerDescription.loadStage)
                handlerDescription.loadStage = "gimmick";
            this.handlers.push(handlerDescription);
        }
    }

    export class GimmickParser {
        domElement: JQuery;
        multilineGimmicks : MultilineGimmickReference[] = [];
        singlelineGimmicks: any[] = [];
        linkGimmicks: any[] = [];
        constructor(domElement: any) {
            this.domElement = $(domElement);
        }
        parse() {
            this.multilineGimmicks = this.getRequiredMultilineGimmicks();
            this.singlelineGimmicks = this.getRequiredSinglelineGimmicks();
        }

        // magic string: gimmick:somegimmck({foo: 'bar'})
        private extractOptionsFromMagicString(s: string): any {
            var r = /gimmick\s?:\s*([^(\s]*)\s*\(?\s*{?(.*)\s*}?\)?/i;
            var matches = r.exec(s);
            if (matches === null || matches[1] === undefined) {
                return null;
            }
            var trigger = matches[1].toLowerCase();
            var args = null;
            // getting the parameters
            if (matches[2] && matches[2].toLowerCase().indexOf("gimmick") != 0) {
                // remove whitespaces
                var params = $.trim(matches[2].toString());
                if (params.charAt (params.length - 1) === ')') {
                    params = params.substring(0, params.length - 1);
                }
                // remove the closing } if present
                if (params.charAt (params.length - 1) === '}') {
                    params = params.substring(0, params.length - 1);
                }

                // add surrounding braces and paranthese
                params = '({' + params + '})';

                // replace any single quotes by double quotes
                var replace_quotes = new RegExp ("'", 'g');
                params = params.replace (replace_quotes, '"');
                // finally, try if the json object is valid
                try {
                    /*jshint -W061 */
                    args = eval(params);
                } catch (err) {
                    $.error('error parsing argument of gimmick: ' + s + ' giving error: ' + err);
                }
            }
            return { options: args, trigger: trigger };
        }

        private getRequiredSinglelineGimmicks(): SinglelineGimmickReference[] {
            var $verbatim = this.domElement.find("code:not(pre > code)");
            var singlelineGimmicks = [];
            $.each($verbatim, (i,e) => {
                // TODO max split 1 time, watch for " " if no options are present
                var slg = new SinglelineGimmickReference();
                slg.domElement = $(e);
                var gimmickstring = $(e).text();
                var opt = this.extractOptionsFromMagicString(gimmickstring);
                slg.trigger = opt.trigger;
                slg.options = opt.options;
                singlelineGimmicks.push(slg);
            });
            return singlelineGimmicks;
        }

        private getRequiredMultilineGimmicks(): MultilineGimmickReference[] {
            var $verbatim = this.domElement.find("pre > code");
            var multiline_gimmicks: MultilineGimmickReference[] = [];

            // check for multiline gimmick
            $.each($verbatim, (i, e) => {
                var raw_trigger = $(e).attr('class');
                var isMultilineGimmick = raw_trigger && raw_trigger.startsWith("gimmick:");
                if (!isMultilineGimmick)
                    return;

                var mlg = new MultilineGimmickReference();
                mlg.domElement = $(e);
                mlg.text = $(e).text().trim();
                mlg.trigger = raw_trigger.split(':')[1];
                multiline_gimmicks.push(mlg);
            });
            return multiline_gimmicks;
        }
    }

    export class GimmickLoader {
        private gimmicks: Gimmick[] = [];

    }
}
