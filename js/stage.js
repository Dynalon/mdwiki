(function($) {
    'use strict';
    $.Stage = function(name) {
        var self = $.extend($.Deferred(), {});
        self.name = name;
        self.events = [];

        self.reset = function() {
            self.complete = $.Deferred();
            self.outstanding = [];
        };

        self.reset();

        self.subscribe = function(fn) {
            self.events.push(fn);
        };
        self.unsubscribe = function(fn) {
            self.events.remove(fn);
        };

        self.run = function() {
            $(self.events).each(function (i,fn) {
                var d = $.Deferred();
                self.outstanding.push(d);
                var done = function() {
                    d.resolve();
                };
                fn(done);
            });

            // if no events are in our queue, we resolve immediately
            if (self.outstanding.length === 0) {
                self.resolve();
            }

            // we resolve when all our registered events have completed
            $.when.apply($, self.outstanding)
            .done(function() {
                self.resolve();
            })
            .fail(function() {
                self.resolve();
            });
        };

        self.done(function() {
            //console.log('stage ' + self.name + ' completed successfully.');
        });
        self.fail(function() {
            console.log('stage ' + self.name + ' completed with errors!');
        });
        return self;
    };
}(jQuery));
