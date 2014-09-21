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
        private handlers: GimmickHandler[] = [];
        init () {
        }
        constructor(name: string) {
            this.name = name;
        }
        addHandler(handler: any) {
            if (!handler.trigger)
                handler.trigger = this.name;

            this.handlers.push(handler);
        }
    }

    export class GimmickLoader {
        private gimmicks: Gimmick[] = [];

    }
}
