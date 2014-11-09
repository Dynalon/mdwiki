describe('BasicSkeleton', function() {
    'use strict';

    var skeleton;
    var config = {
    };

    beforeEach(function() {
        loadFixtures('rendered-markdown/paragraph.html');
    });

    it('should correctly transform a simple paragraph', function() {
        var section = $('#single-paragraph')[0];
        skeleton = new MDwiki.Legacy.PageSkeleton(config, section);
        skeleton.createBasicSkeleton();
        debugger;
        var text = $.trim($(section).find('.md-text .md-paragraph-content').text());
        expect(text).toBe('This is a sentence.');
    });
});
