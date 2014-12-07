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
            // each stage triggers the next one when finished
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
        private allFinishedDfd: JQueryDeferred<void> = $.Deferred<void>();
        private get isFinished() {
            return this.allFinishedDfd.state() !== 'pending';
        }

        /**
         * @description Hook to allow a function to execute after a stage has finished
         * @returns {JQueryPromise<void>}
         */
        public finished() {
            return this.allFinishedDfd.promise();
        }

        private started = false;
        private numOutstanding = 0;
        private subscribedFuncs: SubscribedFunc[] = [];

        // a stage shouldn't carry a name - the StageChain should map to names
        public name: string;

        constructor(name: string) {
            this.name = name;
        }

        private countdown (): void {
            this.numOutstanding--;
            if (this.numOutstanding == 0) {
                this.allFinishedDfd.resolve();
            }
        }

        /**
         * @description Adds a function that is to be called once the stage starts.
         * No guarantee about the executing order can be given; execution order might change
         * at any time. Functions within the same stage should thus not rely
         * on the execution order.
         *
         * Important: The subscriber function is passed a "done" callback function
         * which should be called after the subscriber function is finished. It is
         * not allowed to add another function to the stage after the done callback
         * was executed (but it is ok for a subscriber function to add another subscriber
         * prior to executing the done callback).
         * @param fn - The function to be called.
         */
        subscribe (fn: SubscribedFunc) : void {
            if (this.isFinished)
                throw 'Stage already finished, cannot subscribe';

            this.numOutstanding++;
            if (this.started)
                fn(() => this.countdown());
            else
                this.subscribedFuncs.push(fn);
        }

        /**
         * @description starts the stage, running all subscribed callbacks.
         */
        start() {
            console.dir ("running stage " + this.name);
            this.started = true;

            if (this.numOutstanding == 0) {
                this.allFinishedDfd.resolve();
                return;
            }

            this.subscribedFuncs.forEach(subbedFn => {
                subbedFn(() => this.countdown());
            });
        }
    }
}
