describe('DataModels', function() {
    'use strict';

    var config = {};

    describe('NavigationModel', function () {
        var navParser;
        beforeEach(function () {
            loadFixtures('rendered-markdown/navigation.html');
            navParser = new MDwiki.DataModels.NavigationBarParser();
        });

        it('should find the page title', function() {
            var navElements = $("#basic-navigation").children();
            var model = navParser.parse(navElements);
            expect(model.pageTitle).toBe("MDwiki");
        });


        it('should find all top-level menu entries',function() {
            var navElements = $("#basic-navigation").children();
            var model = navParser.parse(navElements);
            expect(model.toplevelEntries.length).toBe(3);
        });

        it('find sublevel entries',function() {
            var navElements = $("#basic-navigation").children();
            var model = navParser.parse(navElements);
            expect(model.toplevelEntries[1].childs.length).toBe(5);
        });
    });
});
