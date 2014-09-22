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
        constructor(name: string) {
            if (arguments.length == 0) {
                throw "name argument is required for the Gimmick constructor";
            }
            this.name = name;
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
            this.globalGimmickRegistry.push(gmck);
        }

        // TODO write test
        selectHandler(trigger: string, kind: string): Function[] {
            var matching_trigger_and_kind = [];

            this.globalGimmickRegistry.forEach(gmck => {
                gmck.handlers.forEach(handler => {
                    if (handler.trigger == trigger)
                    matching_trigger_and_kind.push(handler);
                });
            });
            return matching_trigger_and_kind;
        }
    }
}
