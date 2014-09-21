describe('Gimmick', function() {

    beforeEach(function() {
        // loadFixtures('gimmick.html');
    });

    // finding checks
    it('should be able to add a single line handler', function() {
    	var callback = function(trigger, content, options, domElement) {
    		// pass
    	};
    	var handler = new MDwiki.Gimmick.GimmickHandler();
    	handler.callback = callback;
    	handler.loadStage = 'gimmick';
    	handler.kind = 'singleline';

    	var gmck = new MDwiki.Gimmick.Gimmick();
    	gmck.trigger = 'math';
    	gmck.addHandler(handler);

    	expect(gmck.handlers.length).toBe(1);
    });
});
