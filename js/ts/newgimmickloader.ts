///<reference path="../../typings/tsd.d.ts" />

module MDwiki.Gimmick {

    export interface IMultilineGimmickHandler {
        (trigger: string, content: string, options: any, domElement: any): void;
    }
    export interface ISinglelineGimmickCallback {
        (trigger: string, content: string, options: any, domElement: any): void;
    }
    export interface ILinkGimmickHandler {
        (trigger: string, text: string, options: any, domElement:any)
    }

    export class GimmickHandler {
        callback: Function;
        loadStage: string = 'gimmick';
        kind: string = 'link';
        trigger: string;

        // reference to the gimmick the handler belongs,
        public get gimmick (): Gimmick {
            return this.gimmickReference;
        }
        gimmickReference: Gimmick;

        constructor(kind?: string, callback?: Function) {
            if (kind)
                this.kind = kind;
            if (callback)
                this.callback = callback; 
        }
    }
    export class ScriptResource {
        constructor (
            public url: string,
            public loadstage: string = 'pregimmick',
            public finishstage: string = 'gimmick'
        ) { }
    }

    export class Gimmick {
        name: string;
        handlers: GimmickHandler[] = [];

        private initFunctions = $.Callbacks();

        // should be called by the implementor to register init functions
        initFunction (initFn: Function) {
            this.initFunctions.add(initFn);
        }

        // should only be called internall by MDwiki to trigger initialization
        init(stageLoader) {
            this.initFunctions.fire(stageLoader);
        }

        // TODO create a test passing of 2nd paramter
        constructor(name: string, handler?: GimmickHandler) {
            if (arguments.length == 0) {
                throw "name argument is required for the Gimmick constructor";
            }
            this.name = name;

            if (handler)
                this.addHandler(handler);
        }
        addHandler(handler: GimmickHandler) {
            if (!handler.trigger)
                handler.trigger = this.name;

            handler.gimmickReference = this;
            this.handlers.push(handler);
        }
        findHandler(kind: string, trigger: string) {
            var match = null;
            this.handlers.forEach(handler => {
                if (handler.trigger == trigger && handler.kind == kind)
                    match = handler;
            });
            return match;
        }
        registerScriptResource (res: ScriptResource) {
            var loadDone = $.Deferred();

            // load the script
            $.md.stage(res.loadstage).subscribe(done => {
                if (res.url.startsWith('//') || res.url.startsWith('http')) {
                    $.getScript(res.url, () => loadDone.resolve());
                } else {
                    // inline script that we directly insert
                    // jQuery does some magic when inserting inline scripts, so better
                    // use vanilla JS. See:
                    // http://stackoverflow.com/questions/610995/jquery-cant-append-script-element
                    // scripts always need to go directly into the DOM
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.text = res.url;
                    document.body.appendChild(script);
                    loadDone.resolve();
                }
                done();
            });

            // wait for the script to be fully loaded
            $.md.stage(res.finishstage).subscribe(done => {
                loadDone.done(() => done());
            });
        }
    }

    export class GimmickLoader {
        private globalGimmickRegistry: Gimmick[] = [];
        private domElement: JQuery;

        constructor (domElement) {
            this.domElement = domElement || $(document);
        }

        private selectHandler(kind: string, trigger: string): GimmickHandler {
            var matching_trigger_and_kind = null;

            this.globalGimmickRegistry.forEach(gmck => {
                var handler = gmck.findHandler(kind, trigger);
                if (handler != null)
                    matching_trigger_and_kind = handler;
            });

            return matching_trigger_and_kind;
        }

        private findGimmick(name: string): Gimmick {
            var found = this.globalGimmickRegistry.filter(gmck => {
                return gmck.name == name;
            });
            if (found.length == 0)
                return null;
            else
                return found[0];
        }

        registerGimmick(gmck: Gimmick) {
            var already_registered = this.globalGimmickRegistry.some(g => g.name == gmck.name);
            if (already_registered)
                throw "A gimmick by that name is already registered";

            this.globalGimmickRegistry.push(gmck);
        }

        initializeGimmick(name: string) {
            var gmck = this.findGimmick(name);

            if (gmck == null)
                return;

            gmck.init($.md.stage);
        }

        runSinglelineGimmicks(references: SinglelineGimmickReference[]) {
            references.forEach(ref => {
                this.runSinglelineGimmick(ref);
            });
        }
        private runSinglelineGimmick(ref: SinglelineGimmickReference) {
            var handler = this.selectHandler('singleline', ref.trigger);
            handler.callback(ref.trigger, ref.text, ref.options, ref.domElement);
        }
        runMultilineGimmicks(references: MultilineGimmickReference[]) {
            references.forEach(ref => {
                this.runMultilineGimmick(ref);
            });
        }
        private runMultilineGimmick(ref: MultilineGimmickReference) {
            var handler = this.selectHandler('multiline', ref.trigger);
            // TODO trim whitespace & retrieve content
            handler.callback(ref.trigger, ref.text, ref.options, ref.domElement);
        }
        runLinkGimmicks(references: LinkGimmickReference[]) {
            references.forEach(ref => {
                this.runLinkGimmick(ref);
            });
        }
        private runLinkGimmick(ref: LinkGimmickReference) {
            var handler = <GimmickHandler> this.selectHandler('link', ref.trigger);
            handler.callback(ref.trigger, ref.text, ref.options, ref.domElement);
        }
    }
}
