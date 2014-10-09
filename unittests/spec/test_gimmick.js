describe('GimmickHandler', function() {
    'use strict';
    // although tests seem useless/reduntant, we keep them in place
    // to make sure our API exposed to users doesn't change
    it('should have sane default values ', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        expect(handler.loadStage).toBe('gimmick');
        expect(handler.kind).toBe('link');
        expect(handler.callback).toBeUndefined();
        expect(handler.trigger).toBeUndefined();
    });
    it('should populate from the constructor', function() {
        var sampleFunction = function() {};
        var handler = new MDwiki.Gimmick.GimmickHandler('singleline', sampleFunction);
        expect(handler.kind).toBe('singleline');
        expect(handler.callback).toBe(sampleFunction);
    });
});

describe('Gimmick', function() {

    beforeEach(function() {
        // loadFixtures('gimmick.html');
    });

    // finding checks
    it('should be able to add a single line handler', function() {
        var callback = function(trigger, content, options, domElement) {};
        var handler = new MDwiki.Gimmick.GimmickHandler();
        handler.callback = callback;
        handler.loadStage = 'gimmick';
        handler.kind = 'singleline';
        handler.trigger = 'math';

        var gmck = new MDwiki.Gimmick.Gimmick('somename');
        gmck.addHandler(handler);

        expect(gmck.handlers.length).toBe(1);
    });
    it('should set the default handler trigger to the gimmick name', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        handler.callback = function() {};

        var gmck = new MDwiki.Gimmick.Gimmick('somename');
        gmck.addHandler(handler);

        expect(gmck.handlers[0].trigger).toBe('somename');
    });
    it('should use the handler`s trigger name instead of the default one if it is given', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        handler.callback = function() {};
        handler.trigger = 'sometrigger';

        var gmck = new MDwiki.Gimmick.Gimmick('somename');
        gmck.addHandler(handler);

        expect(gmck.handlers[0].trigger).toBe('sometrigger');
    });
    it('should throw an exception if the constructor argument `name` is missing', function() {
        expect(function() {
            new MDwiki.Gimmick.Gimmick();
        }).toThrow();
    });
    it('should allow a handler to optionally passed to the constructor', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        handler.callback = function() {};
        var gmck = new MDwiki.Gimmick.Gimmick('somename', handler);
        expect(gmck.handlers.length).toBe(1);

        // now check that we can also create a gimmick without adding a handler
        // in the constructor
        gmck = new MDwiki.Gimmick.Gimmick('othername');
        expect(gmck.handlers.length).toBe(0);
    });
    it('should set a reference to an added handler back to the gimmick', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        var gmck = new MDwiki.Gimmick.Gimmick('somename', handler);
        expect(handler.gimmick).toBe(gmck);

    });
});
