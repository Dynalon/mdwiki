describe('GimmickLoader', function() {

    var loader;
    beforeEach(function() {
        loader = new MDwiki.Gimmick.GimmickLoader();
    });

    it('should be able for a gimmick to register', function() {
        var gmck = new MDwiki.Gimmick.Gimmick('somegimmick');
        var handler = new MDwiki.Gimmick.GimmickHandler('multiline', function() {});
        gmck.addHandler(handler);
        loader.registerGimmick(gmck);
    });
});
