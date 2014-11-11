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
        var text = $.trim($(section).find('.md-text .md-paragraph-content').text());
        expect(text).toBe('This is a sentence.');
    });

    it('should have moved left floated images out of the paragraph', function() {
        var section = $('#single-paragraph-with-image')[0];
        skeleton = new MDwiki.Legacy.PageSkeleton(config, section);
        skeleton.createBasicSkeleton();

        var number_of_images_in_paragraph = $(section).find('p img').length;
        expect(number_of_images_in_paragraph).toBe(0);
        var image_in_floatenv = $(section).find('.md-text .md-float-left img').length === 1;
        debugger;
        expect(image_in_floatenv).toBeTruthy();
    });
});
