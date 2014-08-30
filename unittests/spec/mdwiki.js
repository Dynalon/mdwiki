describe("Gimmickloader", function() {
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
        testGimmick = new MDwiki.Core.NewGimmick();
    });

    it('should load the gimmick fixture html skeleton', function() {
        var d = $('#gimmick-fixture');
        expect(d.length).toBe(1);
    });

    it('should load find the text of a mulitline gimmick', function() {
        var myCallback = function(trigger, text, options, domElement) {
            expect(text).toBe("This is a text");
        };
        var $mlg = $('#multiline-gimmick');
        testGimmick.Handlers.push(myCallback);

        var loa
        der = new MDwiki.Core.GimmickLoader();
        loader.getMultilineGimmicks($mlg);
        expect($mlg.length).toBe(1);
    });

    it('should get a list of gimmicks that are required on a page') {

    }

    it('should initialize a gimmick that is required on a page') {

    }
    it('should not initialize a gimmick that is not required on a page') {

    }
    it('should call the handler for a multiline gimmick') {

    }
    it('should call the handler for a singleline gimmick') {

    }
    it('should call the handler for a link gimmick') {

    }
});


describe("Gimmick", function() {
    var testGimmick;

    beforeEach(function() {
        loadFixtures('gimmick.html');
    });

    it('should create a new gimmick and have a name') {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        expect(testGimmick.name).toBe('myGimmick');
    }


    it('should be able to register a multiline handler') {
        testGimmick.addHandler({
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
    }

    it('should be able to register a singleline handler') {
        testGimmick.addHandler({
            type: 'singleline',
            handler: function(text, options, domElement) {
            }
        });
    }

    it('should be able to register a singleline handler with a given loadstage') {
        testGimmick.addHandler({
            type: 'singleline',
            loadstage: 'postgimmick',
            handler: function(text, options, domElement) {
            }
        });
    }

    it('should be able to register a link handler') {
        testGimmick.addHandler({
            type: 'singleline',
            handler: function(text, options, domElement) {
            }
        });
    }

    it('should be able to register a handler without a trigger name') {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
    }

    it('should be able to register a handler with a trigger name') {
        testGimmick = new MDwiki.Core.NewGimmick('myGimmick');
        testGimmick.addHandler({
            trigger: 'nondefaulttrigger'
            type: 'multiline',
            handler: function(text, options, domElement) {
            }
        });
    }
});
