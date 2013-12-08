declare var $: any;
declare var marked: any;

module MDwiki.Core {
    export class Wiki {
        public stages: StageChain = new StageChain();

        constructor() {
            var stage_names = (['init','load','transform','ready','skel_ready',
                'bootstrap', 'pregimmick', 'gimmick', 'postgimmick', 'all_ready',
                'final_tests'
            ]);
            stage_names.map(n => this.stages.append (new Stage(n)));
        }

        run() {
            // main run loop
            var t = new BootswatchTheme('foo');
            this.registerCoreFunctionality();
            this.registerFinalTasks();
            // start the stages chain with the init stage
            this.stages.run();
        }
        registerCoreFunctionality() {

            // fetch config.json
            $.md.stage('init').subscribe(done => {
                $.when(
                    Resource.fetch('config.json'),
                    Resource.fetch('navigation.md')
                ).then( (config, nav) => {
                    var data_json = JSON.parse(config[0]);

                    $.md.config = $.extend($.md.config, data_json);

                    this.registerBuildNavigation(nav[0]);
                    done();
                });
            });

            // register fetch main content

            // when all three are ready...
            // apply config.json
            // transform main content
            // process includes & previews
            //

            // register process page links (have to be done after gimmicks)
        }
        registerBuildNavigation(navMD: string) {

            $.md.stage('transform').subscribe(function(done) {
                if (navMD === '') {
                    var log = $.md.getLogger();
                    log.info('no navgiation.md found, not using a navbar');
                    done();
                    return;
                }
                var navHtml = marked(navMD);
                var h = $('<div>' + navHtml + '</div>');
                // TODO .html() is evil!!!
                h.find('br').remove();
                h.find('p').each(function(i,e) {
                    var el = $(e);
                    el.replaceWith(el.html());
                });
                $('#md-menu').append(h.html());
                done();
            });

            $.md.stage('bootstrap').subscribe(function(done) {
                $.md.processPageLinks($('#md-menu'));
                done();
            });

            $.md.stage('postgimmick').subscribe(function(done) {
                // hide if has no links
                done();
            });
        }

        registerFinalTasks () {

            // wire the stages up
            $.md.stage('all_ready').finished().done(function() {
                $('html').removeClass('md-hidden-load');

                // phantomjs hook when we are done
                if (typeof window['callPhantom'] === 'function') {
                    window['callPhantom']({});
                }

                //$.md.stage('final_tests').start();
            });
            $.md.stage('final_tests').finished().done(function() {

                // required by dalekjs so we can wait the element to appear
                $('body').append('<span id="start-tests"></span>');
                $('#start-tests').hide();
            });
        }
    }
}
