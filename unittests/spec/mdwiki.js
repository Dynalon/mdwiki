describe('Gimmickloader', function() {
    var testGimmick;

/*
    testGimmick.addHandler('multiline', {
        namepsace: 'g',
        trigger: 'somegimmick',
        callback: myCallback
    });
*/
    beforeEach(function() {
        loadFixtures('gimmick.html');
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
    });

    it('should load the gimmick fixture html skeleton', function() {
        var d = $('#gimmick-fixture');
        expect(d.length).toBe(1);
    });


    it('should pass the code DOM element in a multiline gimmick', function() {
        var code_element = $('#multiline-gimmick').find('code');
        var myCallback = function(trigger, text, options, domElement) {
            expect(domElement).toEqual(code_element);
        };
        var loader = new MDwiki.Core.GimmickLoader();
    });

/*
    it('should get a list of gimmicks that are required on a page') {

    };

    it('should initialize a gimmick that is required on a page') {
    };
    it('should not initialize a gimmick that is not required on a page') {
    };
    it('should call the handler for a multiline gimmick') {
    };
    it('should call the handler for a singleline gimmick') {
    };
    it('should call the handler for a link gimmick') {
    }; */
});


describe('Gimmick', function() {
    var testGimmick;

    beforeEach(function() {
        loadFixtures('gimmick.html');
    });

    it('should create a new gimmick and have a name', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        expect(testGimmick.name).toBe('myGimmick');
    });


    it('should be able to register a multiline handler', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });

    it('should be able to register a singleline handler', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'singleline',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });

    it('should be able to register a singleline handler with a given loadstage', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'singleline',
            loadstage: 'postgimmick',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });

    it('should be able to register a link handler', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'singleline',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });

    it('should be able to register a handler without a trigger name', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });

    it('should be able to register a handler with a trigger name', function() {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            trigger: 'nondefaulttrigger',
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
        expect(testGimmick.handlers.length).toBe(1);
    });
});
