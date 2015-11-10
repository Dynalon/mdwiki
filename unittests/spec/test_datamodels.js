describe('DataModels', function() {
    'use strict';

    var config = {};

    describe('NavigationModel', function () {
        var navParser;
        beforeEach(function () {
            loadFixtures('rendered-markdown/navigation.html');
            var navElements = $("#basic-navigation").children();
            navParser = new MDwiki.DataModels.NavigationBarParser(navElements);
        });

        it('should find the page title', function() {
            var model = navParser.parse();
            expect(model.pageTitle).toBe("MDwiki");
        });


        it('should find all top-level menu entries',function() {
            var model = navParser.parse();
            expect(model.toplevelEntries.length).toBe(3);
        });

        it('find sublevel entries',function() {
            var model = navParser.parse();
            expect(model.toplevelEntries[1].childs.length).toBe(5);
        });
    });
});
