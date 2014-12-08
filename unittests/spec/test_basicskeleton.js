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

    it('should have moved left floated images into the left float environment', function() {
        var section = $('#single-paragraph-with-left-float-image')[0];
        skeleton = new MDwiki.Legacy.PageSkeleton(config, section);
        skeleton.createBasicSkeleton();

        var number_of_images_in_paragraph = $(section).find('p img').length;
        expect(number_of_images_in_paragraph).toBe(0);
        var image_in_floatenv = $(section).find('.md-text .md-float-left img').length === 1;
        expect(image_in_floatenv).toBeTruthy();
    });

    it('should have moved right floated images into the right float environment', function() {
        var section = $('#single-paragraph-with-right-float-image')[0];
        skeleton = new MDwiki.Legacy.PageSkeleton(config, section);
        skeleton.createBasicSkeleton();

        var number_of_images_in_paragraph = $(section).find('p img').length;
        expect(number_of_images_in_paragraph).toBe(0);
        var image_in_floatenv = $(section).find('.md-text .md-float-right img').length === 1;
        expect(image_in_floatenv).toBeTruthy();
    });

    it('should not have removed any regular links from the paragraph', function() {
        var section = $('#single-paragraph-with-image-and-link')[0];
        skeleton = new MDwiki.Legacy.PageSkeleton(config, section);
        skeleton.createBasicSkeleton();

        var number_of_links_in_paragraph = $(section).find('p a').length;
        expect(number_of_links_in_paragraph).toBe(1);
    });
});
