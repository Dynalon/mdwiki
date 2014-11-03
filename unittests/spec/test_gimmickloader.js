describe('GimmickLoader', function() {
    'use strict';
    var loader;
    beforeEach(function() {
        loader = new MDwiki.Gimmick.GimmickLoader();
    });

    describe('Gimmick registration', function() {
        it('should be able for a gimmick to register', function() {
            var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
            var handler = new MDwiki.Gimmick.GimmickHandler('multiline', function() {});
            gmck.addHandler(handler);
            expect(function() {
                loader.registerGimmick(gmck);
            }).not.toThrow();
        });
        it('should throw an error if a gimmick with same name is already registered', function() {
            var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
            loader.registerGimmick(gmck);
            expect(function() {
                loader.registerGimmick(gmck);
            }).toThrow();
        });
    });

    describe('Handler selection', function() {
        function setupGimmick(kind) {
            var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
            var callback = function() {};
            var handler = new MDwiki.Gimmick.GimmickHandler(kind);
            handler.callback = callback;
            gmck.addHandler(handler);
            loader.registerGimmick(gmck);
            return handler;
        }

        it('should be able to select a handler that fit a kind and trigger', function() {
            var handler = setupGimmick('multiline'); 
            var selected_handler = loader.selectHandler('multiline', 'somegimmick');
            expect(selected_handler).toBe(handler);
        });
        it('should not select a handler that fits the trigger but not the kind', function() {
            setupGimmick('singleline');
            var selected_handler = loader.selectHandler('multiline', 'somegimmick');
            expect(selected_handler).toBeNull();
        });
        it('should not select a handler that fits the kind but not the trigger', function() {
            var handler = setupGimmick('multiline');
            var selected_handler = loader.selectHandler('multiline', 'unknowngimmick');
            expect(selected_handler).toBeNull();
        });
    });

    describe('Gimmick execution', function() {
        var gmck;
        beforeEach(function() {
            gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
            loadFixtures('gimmick.html');
        });

        /*
        it('should execute a single line gimmick', function() {
            var dummy_dom_element;
            var ref;
            var callback = function(trigger, content, options, domElement) {
                expect(trigger).toBe('somegimmick');
                expect(domElement).toBe(dummy_dom_element);
                expect(options).toBe(ref.options);
            };
            var handler = new MDwiki.Gimmick.GimmickHandler('singleline');
            handler.callback = callback;
            gmck.addHandler(handler);
            loader.registerGimmick(gmck);

            ref = new MDwiki.Gimmick.SinglelineGimmickReference();
            dummy_dom_element = $("<div/>");
            ref.trigger = 'somegimmick';
            ref.domElement = dummy_dom_element;
            ref.options = {};

            loader.runSinglelineGimmicks([ref]);
        });
        */
    });

    it('can initialize a registered gimmick', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var wasCalled = false;
        gmck.init = function() { wasCalled = true; };
        loader.registerGimmick(gmck);
        loader.initializeGimmick('somegimmick', function() {});
        expect(wasCalled).toBe(true);
    });
});
