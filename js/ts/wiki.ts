///<reference path="utils.ts" />

declare var marked: any;
import Gimmick = MDwiki.Gimmick;
import GimmickLoader = MDwiki.Gimmick.GimmickLoader;
import Links = MDwiki.Links;
import StageChain = MDwiki.Stages.StageChain;
import Stage = MDwiki.Stages.Stage;
import dummyutil = MDwiki.Utils.Url;

module MDwiki.Core {

    var defaultConfig = {
        title:  null,
        lineBreaks: 'gfm',
        additionalFooterText: '',
        useSideSubMenu: true,
        anchorCharacter: '&para;',
        pageMenu: {
            disable: false,
            returnAnchor: "[top]",
            useHeadings: "h2",
            useHeadings2: "h3",
        },
        parseHeader: false
    };

    export class Wiki {
        public stages: StageChain;
        public gimmicks: GimmickLoader;
        private domElement: JQuery;
        private config: any = defaultConfig;

        constructor(gimmickLoader: GimmickLoader, stages: StageChain, domElement?: any) {
            this.stages = stages;
            this.gimmicks = gimmickLoader;
            this.domElement = $(domElement || document);
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
            // fetch config.json
            this.stages.getStage('init').subscribe(done => {
                var dfd1 = Resource.fetch('config.json');
                var dfd2 = Resource.fetch('navigation.md');
                dfd1.done(config => {
                    dfd2.done(nav => {
                        var data_json = JSON.parse(config);
                        this.config = $.extend(this.config, data_json);
                        this.registerBuildNavigation(nav);
                        done();
                    });
                });
            });
        }
        private registerPageTransformation() {
            this.stages.getStage('ready').subscribe((done) => {
                var page_skeleton = new MDwiki.Legacy.PageSkeleton(this.config, document);
                page_skeleton.createBasicSkeleton();
                done();
            });

            // If the user has set the theme in config
            this.stages.getStage('bootstrap').subscribe((done) => {
                if(this.config.useTheme !== null && this.config.useTheme !== undefined && this.config.useTheme.toLowerCase() !== 'default') {
                    var theme = new MDwiki.Core.BootswatchTheme(this.config.useTheme);
                    $('link[rel=stylesheet][href*="bootstrapcdn.com"]')
                    .replaceWith(
                        $('<link rel="stylesheet" type="text/css">').attr('href', theme.styles[0])
                    );
                }
                done();
            })

            this.stages.getStage('bootstrap').subscribe((done) => {
                var bootstrapper = new MDwiki.Legacy.Bootstrap(this.stages, this.config);
                bootstrapper.bootstrapify();
                Links.LinkRewriter.processPageLinks($('#md-content'), $.md.baseUrl);
                done();
            });
        }

        private transformMarkdown(markdown: string) {
            var options = {
                gfm: true,
                tables: true,
                breaks: true
            };
            if (this.config.lineBreaks === 'original')
                options.breaks = false;
            else if (this.config.lineBreaks === 'gfm')
                options.breaks = true;

            marked.setOptions(options); // useless since it's set anyway in the transformer's constructor

            // get sample markdown
            var transformer = new MDwiki.Markdown.Markdown(markdown, options);
            var html = transformer.transform();
            var processor = new MDwiki.Markdown.MarkdownPostprocessing();
            // TODO eliminate double conversion from/to html/jquery
            var $dom = $("<a/>").wrapInner($(html));
            processor.process($dom);
            var html = $dom.html();
            return html;
        }

        private registerClearContent() {
            this.stages.getStage('init').subscribe(function(done) {
                $('#md-all').empty();
                var skel ='<div id="md-body"><div id="md-title"></div><div id="md-menu">'+
                    '</div><div id="md-content"></div></div>';
                $('#md-all').prepend($(skel));
                done();
            });
        }
        private registerFetchMarkdown() {
            var md = '';
            this.stages.getStage('init').subscribe(function(done) {
                var ajaxReq = {
                    url: $.md.mainHref,
                    dataType: 'text'
                };
                $.ajax(ajaxReq).done(function(data) {
                    // TODO: do this elsewhere
                    md = data;
                    done();
                }).fail(function() {
                    var log = $.md.getLogger();
                    log.fatal('Could not get ' + $.md.mainHref);
                    done();
                });
            });

            // find baseUrl
            this.stages.getStage('transform').subscribe(function(done) {
                var len = $.md.mainHref.lastIndexOf('/');
                var baseUrl = $.md.mainHref.substring(0, len+1);
                $.md.baseUrl = baseUrl;
                done();
            });

            this.stages.getStage('transform').subscribe(done => {
                var uglyHtml = this.transformMarkdown(md);
                $('#md-content').html(uglyHtml);
                md = '';
                done();
            });
        }

        private registerGimmickLoad() {
            var parser = new Gimmick.GimmickParser(this.domElement);
            this.stages.getStage('post_transform').subscribe((done: DoneCallback) => {
                parser.parse();
                this.gimmicks.initializeGimmicks(parser);

                this.gimmicks.subscribeGimmickExecution(parser);

                done();
            });
        }
        private registerBuildNavigation(navMD: string) {
            this.stages.getStage('transform').subscribe(function(done) {
                if (navMD === '') {
                    var log = $.md.getLogger();
                    log.info('no navigation.md found, not using a navbar');
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

            this.stages.getStage('bootstrap').subscribe(function(done) {
                Links.LinkRewriter.processPageLinks($('#md-menu'));
                done();
            });

            this.stages.getStage('postgimmick').subscribe(function(done) {
                // hide if has no links FIXME: Should be a TODO:???
                done();
            });
        }

        private registerFinalTasks () {

            // wire the stages up
            this.stages.getStage('all_ready').finished().done(function() {
                $('html').removeClass('md-hidden-load');

                // phantomjs hook when we are done
                if (typeof window['callPhantom'] === 'function') {
                    window['callPhantom']({});
                }

                //this.stages.getStage('final_tests').start();
            });
            this.stages.getStage('final_tests').finished().done(function() {

                // required by dalekjs so we can wait the element to appear
                $('body').append('<span id="start-tests"></span>');
                $('#start-tests').hide();
            });
        }
    }
}
