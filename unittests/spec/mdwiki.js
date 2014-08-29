describe("MDwiki", function() {
    var testGimmick = new MDwiki.Core.NewGimmick();

    // pre/code fields
    var myCallback = function(content, domElement) {

    };

    // links
    var myLinkCallback = function(text, href, domElement) {

    };

    testGimmick.addHandler('multiline', {
        namepsace: 'g',
        trigger: 'alert',
        callback: myCallback
    });


    testGimmick.addHandler('link', {
        namespace: 'g',
        trigger: 'gist',
        callback: myLinkCallback
    });

    beforeEach(function() {
        loadFixtures('gimmick.html');
    });

    it('should be be loaded', function() {
        var d = $('#my-fixture');
        expect('true').toBe('true');
    });
});
