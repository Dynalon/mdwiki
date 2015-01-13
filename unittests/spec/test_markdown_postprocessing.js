describe('MarkdownPostProcessor', function() {
    'use strict';
    var postprocessor;
    beforeEach(function() {
        loadFixtures('rendered-markdown/markdown-postprocessing.html');
        postprocessor = new MDwiki.Markdown.MarkdownPostprocessing();
    });

    //marked.setOptions({breaks: true, gfm: true});
    //var rendered = marked(md);

    it('should correctly postprocess a multiline gimmick', function() {
        var input = $("#postprocessing-multiline-gimmick");
        postprocessor.process(input);

        expect(input.find("code").hasClass("gimmick:somegimmick")).toBe(true);
        expect(input.find("code").hasClass("lang-gimmick:somegimmick")).toBe(false);
    });
});
