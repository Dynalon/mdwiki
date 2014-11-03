declare var marked: any;

module MDwiki.Core {

    export interface DoneCallback {
        (): void;
    }
    export interface SubscribedFunc {
        (cb:DoneCallback): void;
    }

    export class Resource {
        constructor(public url:string, public dataType:string = 'text') {
        }

        static fetch(url:string, dataType:string = 'text') {
            var jqxhr = $.ajax({
                url: url,
                dataType: dataType
            });
            return jqxhr;
        }
    }
}

import SubscribedFunc = MDwiki.Core.SubscribedFunc;
module MDwiki.Stages {

    export class StageChain
    {
        private defaultStageNames = ['init','load','transform','post_transform', 'ready','skel_ready',
        'bootstrap', 'pregimmick', 'gimmick', 'postgimmick', 'all_ready',
        'final_tests'
        ];

        private stages: Stage[] = [];

        constructor(stageNames?: string[]) {
            if (!stageNames)
                stageNames = this.defaultStageNames;

            stageNames.map(n => this.append (new Stage(n)));
        }
        reset() {
            var new_stages: Stage[] = [];
            for (var i = 0; i < this.stages.length; i++) {
                var name = this.stages[i].name;
                new_stages.push(new Stage(name));
            }
        }
        appendArray (st: Stage[]) {
            st.map(s => this.append(s));
        }
        append (s: Stage) {
            var len = this.stages.length;
            if (len == 0) {
                this.stages.push(s);
                return;
            }
            var last = this.stages[len-1];
            last.finished().done(() => s.start());
            this.stages.push(s);
        }
        run () {
            this.stages[0].start();
        }
        // compat funcs
        getStage(name: string) {
            return this.stages.filter(s => s.name == name)[0];
        }
    }

    export class Stage
    {
        private started: boolean = false;
        private subscribedFuncs: SubscribedFunc[] = [];
        public name: string;

        private allFinishedDfd: any = $.Deferred();
        public finished(): any {
            return this.allFinishedDfd;
        }

        constructor(name: string) {
            this.name = name;
        }

        subscribe (fn: SubscribedFunc) : void {
            if (this.started)
                throw 'Stage already started';

            this.subscribedFuncs.push(fn);
        }

        start() {
            console.dir ("running stage " + this.name);
            this.started = true;
            var num_outstanding = this.subscribedFuncs.length;

            if (num_outstanding == 0) {
                this.allFinishedDfd.resolve();
                return;
            }

            this.subscribedFuncs.map(subbedFn => {
                var doneCallback = () => {
                    --num_outstanding || this.allFinishedDfd.resolve();
                };
                subbedFn(doneCallback);
            });
        }
    }
}
