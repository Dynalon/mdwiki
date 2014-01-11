describe('MarkdownPostProcessor', function() {
    'use strict';
    beforeEach(function() {
        loadFixtures('rendered-markdown/markdown-postprocessing.html');
    });

    //marked.setOptions({breaks: true, gfm: true});
    //var rendered = marked(md);

    it('should correctly postprocess a multiline gimmick', function() {
        var input = $("#postprocessing-multiline-gimmick");
        // TODO transform input through postprocessor

        expect(output.hasClass("gimmick:somegimmick")).ToBe(true);
        expect(output.hasClass("lang-gimmick:somegimmick")).ToBe(false);
    });
});
