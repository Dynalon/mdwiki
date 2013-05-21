(function($) {
    'use strict';
    $.Stage = function(name) {
        var self = $.extend($.Deferred(), {});
        self.name = name;
        self.events = [];
        self.started = false;

        self.reset = function() {
            self.complete = $.Deferred();
            self.outstanding = [];
        };

        self.reset();

        self.subscribe = function(fn) {
            if (self.started) {
                $.error('Can not subscribe to stage which already started!');
            }
            self.events.push(fn);
        };
        self.unsubscribe = function(fn) {
            self.events.remove(fn);
        };

        self.run = function() {
            self.started = true;
            $(self.events).each(function (i,fn) {
                var d = $.Deferred();
                self.outstanding.push(d);

                // display an error if our done() callback is not called
                $.md.util.wait(2500).done(function() {
                    if(d.state() !== 'resolved') {
                        $.error('FATAL: Timeout reached for done callback in stage: ' + self.name +
                            '. Did you forget a done() call in a .subscribe() ?');
                    }
                });

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
            console.log('stage ' + self.name + ' completed successfully.');
        });
        self.fail(function() {
            console.log('stage ' + self.name + ' completed with errors!');
        });
        return self;
    };
}(jQuery));
