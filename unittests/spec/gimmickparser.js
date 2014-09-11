describe('GimmickParser', function() {

/*
    testGimmick.addHandler('multiline', {
        namepsace: 'g',
        trigger: 'somegimmick',
        callback: myCallback
    });
*/
    beforeEach(function() {
        loadFixtures('gimmick.html');
    });

    // finding checks
    it('should not treat a singleline gimmick as a mulitline gimmick', function() {
        var $fixture = $('#multiline-gimmick, #singleline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($fixture);
        parser.parse();
        expect(parser.multilineGimmicks.length).toBe(1);
        expect(parser.singlelineGimmicks.length).toBe(1);
    });

    // MULTILINE GIMMICKS
    it('should find a mulitline gimmick', function() {
        var $mlg = $('#multiline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($mlg);
        parser.parse();
        expect(parser.multilineGimmicks.length).toBe(1);
    });
    it('should find the info text of a multiline gimmick', function() {
        var $mlg = $('#multiline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($mlg);
        parser.parse();
        var first_match = parser.multilineGimmicks[0];
        expect(first_match.trigger).toBe('somegimmick');
        expect(first_match.text).toBe('This is a text');
    });
    it('should find the info text of a mulitline gimmick', function() {
        var $mlg = $('#multiline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($mlg);
        parser.parse();
        var first_match = parser.multilineGimmicks[0];
        expect(first_match.trigger).toBe('somegimmick');
        expect(first_match.text).toBe('This is a text');
    });

    // SINGLE LINE GIMMICKS
    it('should find a singleline gimmick', function() {
        var $slg = $('#singleline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        expect(parser.singlelineGimmicks.length).toBe(1);
    });

    it('should find the trigger of a singleline gimmick', function() {
        var $slg= $('#singleline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        var first_match = parser.singlelineGimmicks[0];
        expect(first_match.trigger).toBe('somegimmick');
    });

    it('should find the options of a singleline gimmick', function() {
        var $slg= $('#singleline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        var first_match = parser.singlelineGimmicks[0];
        expect(first_match.options.param1).toBe('foo');
    });

    // TODO complex options tests
    it('should find a null options for a singleline gimmick without options', function() {
        var $slg= $('#simple-singleline-gimmick');
        var parser = new MDwiki.Gimmick.GimmickParser($slg);
        parser.parse();
        var first_match = parser.singlelineGimmicks[0];
        expect(first_match.options).toBe(null);
    });


});
