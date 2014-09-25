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

    it('should be able to select a handler that fit a kind and trigger', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var callback = function() {};
        var handler = new MDwiki.Gimmick.GimmickHandler('multiline');
        handler.callback = callback;
        gmck.addHandler(handler);
        loader.registerGimmick(gmck);

        var selected_handler = loader.selectHandler('multiline', 'somegimmick');
        expect(selected_handler).toBe(handler);
        expect(selected_handler).toBe(handler);
    });

    it('should throw an error if a gimmick with same name is already registered', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        loader.registerGimmick(gmck);
        expect(function() {
            loader.registerGimmick(gmck);
        }).toThrow();
    });

    it('can initialize a registered gimmick', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var wasCalled = false;
        gmck.init = function() { wasCalled = true; };
        loader.registerGimmick(gmck);
        loader.initializeGimmick('somegimmick');
        expect(wasCalled).toBe(true);
    });
});
