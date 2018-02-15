module MDwiki.Gimmick {

    export class MultilineGimmickReference {
        trigger: string;
        text: string;
        domElement: JQuery;
        options: any;
    }
    export class SinglelineGimmickReference {
        trigger: string;
        text: string;
        domElement: JQuery;
        options: any;
    }
    export class LinkGimmickReference {
        trigger: string;
        domElement: JQuery;
        options: any;
        text: string;
    }

    /**
    Parses HTML for the presence of gimmicks, collects the required data and
    stores them internally.
    */
    export class GimmickParser {
        domElement: JQuery;
        multilineReferences: MultilineGimmickReference[] = [];
        singlelineReferences: SinglelineGimmickReference[] = [];
        linkReferences: any[] = [];
        constructor(domElement: any) {
            this.domElement = $(domElement);
        }
        parse() {
            this.multilineReferences = this.getMultilineGimmicks();
            this.singlelineReferences = this.getSinglelineGimmicks();
            this.linkReferences = this.getLinkGimmicks();
        }

        // magic string: gimmick:somegimmck({foo: 'bar'})
        private extractOptionsFromMagicString(s: string): any {
            // we split the string at the FIRST closing parens: )
            // anything right of that is considered additional text
            var gimmick_string = s.split(')', 1)[0];
            var additionalText = $.trim(s.split(")").slice(1).join(")"));
            var r = /gimmick\s?:\s*([^(\s]*)\s*\(?\s*{?(.*)\s*}?\)?/i;
            var matches = r.exec(gimmick_string);

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
                    // FIXME: IS there an alternative for this task beside using eval (eval is evil) see jslint, eslint and jshint warning #061
                    /*jshint -W061 */
                    args = eval(params);
                } catch (err) {
                    $.error('error parsing argument of gimmick: ' + s + ' giving error: ' + err);
                }
            }
            return { options: args, trigger: trigger, additionalText: additionalText };
        }

        private getLinkGimmicks(): LinkGimmickReference[] {
            var linkGimmicks = [];
            var $domLinks =  this.domElement.find("a:icontains(gimmick:)");
            $.each($domLinks, (i, link) => {
                var $link = $(link);
                var text = $link.text();
                var opt = this.extractOptionsFromMagicString(text);
                if (opt === null) return;

                var lg = new LinkGimmickReference();
                lg.text = $link.attr('href');
                lg.options = opt.options;
                lg.trigger = opt.trigger;
                lg.domElement = $link;
                linkGimmicks.push(lg);
            });
            return linkGimmicks;
        }

        private getSinglelineGimmicks(): SinglelineGimmickReference[] {
            var $verbatim = this.domElement.find("code:not(pre > code)");
            var singlelineGimmicks = [];
            $.each($verbatim, (i,e) => { 
                // TODO max split 1 time, watch for " " if no options are present
                var slg = new SinglelineGimmickReference();
                slg.domElement = $(e);
                var gimmickstring = $(e).text();
                var opt = this.extractOptionsFromMagicString(gimmickstring);
                if (!opt) return;
                slg.trigger = opt.trigger;
                slg.options = opt.options;
                slg.text = opt.additionalText;
                singlelineGimmicks.push(slg);
            });
            return singlelineGimmicks;
        }

        private getMultilineGimmicks(): MultilineGimmickReference[] {
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
}
