///<reference path="../../typings/tsd.d.ts" />
declare var marked: any;
import Logger = MDwiki.Util.Logger;

module MDwiki.Core {

    export class Wiki {
        public stages: StageChain = new StageChain();
        public gimmicks: GimmickLoader = new GimmickLoader();

        constructor() {
            var stage_names = (['init','load','transform','ready','skel_ready',
                'bootstrap', 'pregimmick', 'gimmick', 'postgimmick', 'all_ready',
                'final_tests'
            ]);
            stage_names.map(n => this.stages.append (new Stage(n)));
        }

        run() {
            // main run loop
            this.registerFetchConfigAndNavigation();
            this.registerFetchMarkdown();
            this.registerPageTransformation();
            this.registerGimmickLoad ();
            this.registerClearContent();
            this.registerFinalTasks();

            // start the stages chain with the init stage
            this.stages.run();
        }
        private registerFetchConfigAndNavigation() {
            var self = this;
            // fetch config.json
            $.md.stage('init').subscribe(done => {
                var dfd1 = Resource.fetch('config.json');
                var dfd2 = Resource.fetch('navigation.md');
                dfd1.done(function(config) {
                    dfd2.done(function(nav) {
                        var data_json = JSON.parse(config);
                        $.md.config = $.extend($.md.config, data_json);
                        self.registerBuildNavigation(nav);
                        done();
                    });
                });
            });
        }
        private registerPageTransformation() {
            $.md.stage('ready').subscribe(function(done) {
                $.md('createBasicSkeleton');
                done();
            });

            $.md.stage('bootstrap').subscribe(function(done){
                $.mdbootstrap('bootstrapify');
                $.md.processPageLinks($('#md-content'), $.md.baseUrl);
                done();
            });

            // register process page links (have to be done after gimmicks)
        }

        private transformMarkdown(markdown: string) {
            var options = {
                gfm: true,
                tables: true,
                breaks: true
            };
            if ($.md.config.lineBreaks === 'original')
                options.breaks = false;
            else if ($.md.config.lineBreaks === 'gfm')
                options.breaks = true;

            marked.setOptions(options);

            // get sample markdown
            var uglyHtml = marked(markdown);
            return uglyHtml;
        }

        private registerClearContent() {
            $.md.stage('init').subscribe(function(done) {
                $('#md-all').empty();
                var skel ='<div id="md-body"><div id="md-title"></div><div id="md-menu">'+
                    '</div><div id="md-content"></div></div>';
                $('#md-all').prepend($(skel));
                done();
            });
        }
        private registerFetchMarkdown() {
            var md = '';
            $.md.stage('init').subscribe(function(done) {
                var ajaxReq = {
                    url: $.md.mainHref,
                    dataType: 'text'
                };
                $.ajax(ajaxReq).done(function(data) {
                    // TODO do this elsewhere
                    md = data;
                    done();
                }).fail(function() {
                    var log = $.md.getLogger();
                    log.fatal('Could not get ' + $.md.mainHref);
                    done();
                });
            });

            // find baseUrl
            $.md.stage('transform').subscribe(function(done) {
                var len = $.md.mainHref.lastIndexOf('/');
                var baseUrl = $.md.mainHref.substring(0, len+1);
                $.md.baseUrl = baseUrl;
                done();
            });

            $.md.stage('transform').subscribe(done => {
                var uglyHtml = this.transformMarkdown(md);
                $('#md-content').html(uglyHtml);
                md = '';
                done();
            });
        }

        private registerGimmickLoad() {
            $.md.stage('ready').subscribe((done: DoneCallback) => {
                this.gimmicks.initModules();
                this.gimmicks.initGimmicks();
                this.gimmicks.loadGimmicks();
                done();
            });

        }
        private registerBuildNavigation(navMD: string) {
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

        private registerFinalTasks () {

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
