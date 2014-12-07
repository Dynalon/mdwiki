describe('Stages', function() {
    'use strict';

    describe('StageChain', function() {

        var two_test_stages = ['first', 'second']

        it('should process all stages', function (jasmineDone) {
            var stage_chain = new MDwiki.Stages.StageChain(two_test_stages);

            var count = 0;
            stage_chain.getStage("first").subscribe(function (done) {
                count++;
                done();
            });
            stage_chain.getStage("second").subscribe(function (done) {
                count++;
                done();
            });
            stage_chain.run();
            expect(count).toBe(2);
            jasmineDone();
        });
        it('should not allow a stage to a previous stage', function(jasmineDone) {
            var stage_chain = new MDwiki.Stages.StageChain(two_test_stages);
            var exception_thrown = false;
            
            stage_chain.getStage('second').subscribe(function(done) {
                try {
                    stage_chain.getStage('first').subscribe(function(done) {
                        done();
                    });
                } catch (ex) {
                    exception_thrown = true;
                }
                done();
            });
            stage_chain.run();

            expect(exception_thrown).toBeTruthy();
            jasmineDone();
        });
    });

    describe("Stage", function() {
        it("should allow to subscribe to self", function() {
            var stage = new MDwiki.Stages.Stage('sample');
            var count = 0;
            stage.subscribe(function(done1) {
                count++;
                stage.subscribe(function(done2) {
                    count++;
                    done2();
                });
                done1();
            });
            stage.start();
            expect(count).toBe(2);
        });
        it('shoud not allow subscription after it is finished', function() {
            var stage = new MDwiki.Stages.Stage('sample');
            var executed = false;
            var ok = false;
            stage.start();
            try {
                stage.subscribe(function(done) {
                    executed = true;
                });
            } catch (ex) {
                ok = true;
            }
            expect(ok).toBeTruthy();
            expect(executed).toBeFalsy();
        });
        it('should execute several async methods in parallel', function() {
            var stage = new MDwiki.Stages.Stage('sample');
            stage.subscribe(function(done) {
                done();
            });
        });
    });
});