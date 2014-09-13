///<reference path="../../typings/tsd.d.ts" />

module MDwiki.Gimmick {

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

    export class GimmickLoader {
        private gimmicks: Gimmick[] = [];

    }
}
