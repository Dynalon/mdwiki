///<reference path="../../typings/tsd.d.ts" />
///<reference path="utils.ts" />

declare var Hogan: any;

module MDwiki.Templating {
    export class Template {

        public view: string = '';
        public model: any = {};

        private renderedTemplate: any;

        constructor(path?: string) {
            if (path) {
                if (!path.startsWith('/'))
                    path = '/' + path;
                path = '/templates' + path;
                var elem = document.getElementById(path);
                if (!elem)
                    throw "Template view with path " + path + " could not be found";
                this.view = $(elem).html();
            }
        }

        render () {
            // TODO allow precompiled templates
            if (!this.view)
                throw ("View cannot be undefined/null");
            var compiledTemplate = Hogan.compile(this.view);
            this.renderedTemplate = compiledTemplate.render(this.model);
            return this.renderedTemplate;
        }

        private assertTemplateIsReady() {
            if (!this.renderedTemplate)
                return this.render();
        }

        /**
         *
         * @param node - The node that will be replaced
         * @returns {JQuery} The newly inserted node
         */
        replace (node: any) : JQuery {
            this.assertTemplateIsReady();
            var rendered_template = $(this.renderedTemplate);
            $(node).replaceWith(rendered_template);
            return rendered_template;
        }

        appendTo (node: any) {
            this.assertTemplateIsReady();
            return $(this.renderedTemplate).appendTo($(node));
        }

        insertAfter (node: any) {
            this.assertTemplateIsReady();
            return $(this.renderedTemplate).insertAfter(node);
        }
        insertBefore (node: any) {
            this.assertTemplateIsReady();
            return $(this.renderedTemplate).insertBefore(node);
        }
    }
}