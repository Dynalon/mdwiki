describe('GimmickLoader/GimmickParser integration', function () {
    'use strict';
    var gmck;
    var loader;
    beforeEach(function() {
        gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        loadFixtures('gimmick.html');
    });


    /*
    function setupGimmick(callbackFn, kind) {
        kind = kind || 'singleline';
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var handler = new MDwiki.Gimmick.GimmickHandler(kind);
        handler.callback = callbackFn;
        gmck.addHandler(handler);
        loader = new MDwiki.Gimmick.GimmickLoader();
        loader.registerGimmick(gmck);
        return gmck;
    }
    it('should execute singleline gimmicks', function() {
        var callback = function(trigger, options, domElement) {
            expect(trigger).toBe('somegimmick');
        };
        setupGimmick(callback);

        var $slg = $('#singleline-gimmick-simpleoptions');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        loader.runSinglelineGimmicks(parser.singlelineReferences);
    });

    it('should execute a multiline gimmick', function() {
        var $mlg = $('#multiline-gimmick');
        var callback = function(trigger, text, options, domElement) {
            expect(trigger).toBe('somegimmick');
            // TODO find assertion that checks for nonempty string
            expect(text).not.toBe(undefined);
            expect(text).not.toBe(null);
            expect(text).not.toBe('');
            expect(domElement[0]).toBe($mlg.find('code')[0]);
        };
        setupGimmick(callback, 'multiline');
        var parser = new MDwiki.Gimmick.GimmickParser($mlg);
        parser.parse();
        loader.runMultilineGimmicks(parser.multilineReferences);
    });

    it('should execute a link gimmick', function() {
        var $lg = $('#link-gimmick-simpleoptions');
        var callback = function(trigger, text, options, domElement) {
            expect(trigger).toBe('somegimmick');
            expect(text).toBe('This is a text.');
            expect(domElement[0]).toBe($lg.find('a')[0]);
        };
        setupGimmick(callback, 'link');
        var parser = new MDwiki.Gimmick.GimmickParser($lg);
        parser.parse();
        loader.runLinkGimmicks(parser.linkReferences);
    });

    it('should initialize a gimmick prior to calling it', function() {
        var init_called = false;
        var callback = function(trigger, options, domElement) {
            expect(init_called).toBe(true);
        };
        var gmck = setupGimmick(callback);
        gmck.init = function() {
            init_called = true;
        };
        var $slg = $('#singleline-gimmick-nooptions');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        loader.initializeGimmick('somegimmick');
        loader.runSinglelineGimmicks(parser.singlelineReferences);
    });
    */
});