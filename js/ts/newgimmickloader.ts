///<reference path="../../typings/tsd.d.ts" />

module MDwiki.Gimmick {

    export interface IMultilineGimmickHandler {
        (trigger: string, content: string, options: any, domElement: any): void;
    }
    export interface ISinglelineGimmickCallback {
        (trigger: string, content: string, options: any, domElement: any): void;
    }
    export interface ILinkGimmickHandler {
        (trigger: string, options: any, domElement:any)
    }

    export class GimmickHandler {
        callback: any;
        loadStage: string = 'gimmick';
        kind: string = 'link';
        trigger: string;

        constructor(kind?: string, callback?: Function) {
            if (kind)
                this.kind = kind;
            if (callback)
                this.callback = callback; 
        }
    }

    export class Gimmick {
        name: string;
        handlers: GimmickHandler[] = [];
        init () {
        }
        // TODO test passing of 2nd paramter
        constructor(name: string, handler?: Function) {
            if (arguments.length == 0) {
                throw "name argument is required for the Gimmick constructor";
            }
            this.name = name;

            if (handler)
                this.addHandler(handler);
        }
        addHandler(handler: any) {
            if (!handler.trigger)
                handler.trigger = this.name;

            this.handlers.push(handler);
        }
    }

    export class GimmickLoader {
        private globalGimmickRegistry: Gimmick[] = [];

        registerGimmick(gmck: Gimmick) {
            var already_registered = this.globalGimmickRegistry.some(g => g.name == gmck.name);
            if (already_registered)
                throw "A gimmick by that name is already registered";

            this.globalGimmickRegistry.push(gmck);
        }

        // TODO API_SEALING make private
        selectHandler(kind: string, trigger: string): Function {
            var matching_trigger_and_kind;

            this.globalGimmickRegistry.forEach(gmck => {
                gmck.handlers.forEach(handler => {
                    if (handler.trigger == trigger)
                        matching_trigger_and_kind = handler;
                });
            });

            if (!matching_trigger_and_kind)
                return null;
            else
                return matching_trigger_and_kind;
        }

        private findGimmick(name:string): Gimmick {
            var found = this.globalGimmickRegistry.filter(gmck => {
                return gmck.name == name;
            });
            if (found.length == 0)
                return null
            else
                return found[0];
        }

        initializeGimmick(name: string) {
            var gmck = this.findGimmick(name);

            if (gmck == null)
                return;

            gmck.init();
        }

    }
}
