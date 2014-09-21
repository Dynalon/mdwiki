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

        var gmck = new MDwiki.Gimmick.Gimmick();
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
    it('should use the handlers trigger instead of the default one if it is given', function() {
        var handler = new MDwiki.Gimmick.GimmickHandler();
        handler.callback = function() {};
        handler.trigger = 'sometrigger';

        var gmck = new MDwiki.Gimmick.Gimmick('somename');
        gmck.addHandler(handler);

        expect(gmck.handlers[0].trigger).toBe('sometrigger');
    });
});
