describe('GimmickLoader', function() {

    var loader;
    beforeEach(function() {
        loader = new MDwiki.Gimmick.GimmickLoader();
    });

    it('should be able for a gimmick to register', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var handler = new MDwiki.Gimmick.GimmickHandler('multiline', function() {});
        gmck.addHandler(handler);
        expect(function() {
            loader.registerGimmick(gmck);
        }).not.toThrow();
    });

    it('should be able to select all gimmicks that fit a kind and trigger', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var callback = function() {};
        var handler = new MDwiki.Gimmick.GimmickHandler('multiline');
        handler.callback = callback;
        gmck.addHandler(handler);
        loader.registerGimmick(gmck);

        var handlers = loader.selectHandler('multiline', 'somegimmick');
        expect(handlers.length).toBe(1);
        expect(handlers[0]).toBe(handler);
    });

    it('should throw an error if a gimmick with same name is already registered', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        loader.registerGimmick(gmck);
        expect(function() {
            loader.registerGimmick(gmck);
        }).toThrow();
    });
});
