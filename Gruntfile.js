var createIndex = function (grunt, taskname) {
    'use strict';
    var conf = grunt.config('index')[taskname],
        tmpl = grunt.file.read(conf.template);

    grunt.config.set('templatesString', '');

    // register the task name in global scope so we can access it in the .tmpl file
    grunt.config.set('currentTask', {name: taskname});

    grunt.file.write(conf.dest, grunt.template.process(tmpl));
    grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.template + '\'');
};

/*global module:false*/
module.exports = function(grunt) {
    'use strict';
    // Project configuration.

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
    // Metadata.
        pkg: {
            name: 'MDwiki',
            version: '0.7.0'
        },

        ownJsFiles: [
            'js/marked.js',
            'js/init.js',
            'ts_compiled/mdwiki_ts.js',
            'tmp/MDwiki.templates.js',
            'js/main.js',
            'js/util.js',
            'js/basic_skeleton.js',
            'js/bootstrap.js',

            // gimmicks
            'js/gimmicks/templating.js',
            'js/gimmicks/prism.js',

            //'js/gimmicks/googlemaps.js',
            'js/gimmicks/alerts.js',
            //'js/gimmicks/colorbox.js',
            //'js/gimmicks/carousel.js',
            'js/gimmicks/disqus.js',
            //'js/gimmicks/editme.js',
            //'js/gimmicks/facebooklike.js',
            //'js/gimmicks/forkmeongithub.js',
            //'js/gimmicks/gist.js',
            //'js/gimmicks/iframe.js',
            //'js/gimmicks/math.js',
            //'js/gimmicks/leaflet.js',
            //'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js',
            //'js/gimmicks/yuml.js',
            'js/gimmicks/plantuml.js',
            'js/gimmicks/themeChooser.js',

            // default gimmicks
            'js/gimmicks/defaults/singleline.js',
            'js/gimmicks/defaults/multiline.js',
            'js/gimmicks/defaults/link.js'
        ],

        // REMEMBER:
        // * ORDER OF FILES IS IMPORTANT
        // * ALWAYS ADD EACH FILE TO BOTH minified/unminified SECTIONS!
        cssFiles: [
            'tmp/main.min.css',
        ],
        externalCssFiles: [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
        ],
        jsFiles: [
            'bower_components/jquery/jquery.min.js',
            'node_modules/handlebars/dist/handlebars.runtime.min.js',
            'extlib/js/jquery.colorbox.min.js',
            'extlib/js/prism.js',
            'extlib/js/pako_deflate.min.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js',
        ],
        // for debug builds use unminified versions:
        unminifiedCssFiles: [
            'tmp/main.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css'
        ],
        unminifiedJsFiles: [
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js',
            'node_modules/handlebars/dist/handlebars.runtime.js',
            'extlib/js/prism.js',
            'extlib/js/jquery.colorbox.js',
            'extlib/js/pako_deflate.min.js'
        ],

        ts: {
            // TOD: use tsconfig.json as soon as tsconfig.json supports globs/wildcards
            base: {
                tsconfig: "js/ts/tsconfig.json"
            }
        },

        less: {
            min: {
                options: {
                    compress: true,
                },
                files: {
                    'tmp/main.min.css': 'styles/main.less',
                },
            },
            dev: {
                options: {
                    compress: false,
                },
                files: {
                    'tmp/main.css': 'styles/main.less',
                },
            },
        },

        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: true
            },
            dev: {
                src: '<%= ownJsFiles %>',
                dest: 'tmp/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dev.dest %>',
                dest: 'tmp/<%= pkg.name %>.min.js'
            }
        },
        index: {
            release: {
                template: 'index.tmpl',
                dest: 'dist/mdwiki.html'
            },
            debug: {
                template: 'index.tmpl',
                dest: 'dist/mdwiki-debug.html'
            }
        },
        lib_test: {
            src: ['lib/**/*.js', 'test/**/*.js']
        },
        copy: {
            release: {
                expand: false,
                flatten: true,
                src: [ 'dist/mdwiki.html' ],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/mdwiki.html'
            },
            release_debug: {
                expand: false,
                flatten: true,
                src: [ 'dist/mdwiki-debug.html' ],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/mdwiki-debug.html'
            },
            release_templates: {
                expand: true,
                flatten: true,
                src: [ 'release_templates/*' ],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/'
            },
            unittests: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'tmp/MDwiki.js',
                    dest: 'unittests/lib/'
                },
                {
                    expand: true,
                    flatten: true,
                    src: 'bower_components/jquery/jquery.min.js',
                    dest: 'unittests/lib/'
                }]
            }
        },
        shell: {
            zip_release: {
                options: {
                    stdout: true
                },
                command: 'cd release && zip -r mdwiki-<%= grunt.config("pkg").version %>.zip mdwiki-<%= grunt.config("pkg").version %>'
            },
            /* precompilation of our handlebars templates */
            compile_templates: {
                options: {
                    stdout: true
                },
                // -n mdwiki = Namespace is mdwiki
                // -f outputfile
                // -r root for the templates (will mirror the FS structure to the template name)
                // -m = minify
                command: './node_modules/.bin/handlebars -f tmp/MDwiki.templates.js -r templates -m templates/**/*.html'
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'js/*.js',
                'js/**/*.js',
                'js/ts/**/*.ts',
                'js/**/*.tsx',
                'unittests/**/*.js',
                'unittests/**/*.html',
                'templates/**/*.html',
                'index.tmpl'
            ],
            tasks: ['debug','reload' ]
        },
        reload: {
            port: 35729,
            liveReload: {}
        },
        'http-server': {
            'dev': {
                root:'./',
                port: 8080,
                host: "0.0.0.0",
                cache: 1,
                showDir : true,
                autoIndex: true,
                defaultExt: "html",
                runInBackground: false
            }
        }
    });

    /*** CUSTOM CODED TASKS ***/
    grunt.registerTask('index', 'Generate mdwiki.html, inline all scripts', function() {
        createIndex(grunt, 'release');
    });

    /* Debug is basically the releaes version but without any minifing */
    grunt.registerTask('index_debug', 'Generate mdwiki-debug.html, inline all scripts unminified', function() {
        createIndex(grunt, 'debug');
    });

    /*grunt.registerTask('assembleTemplates', 'Adds a script tag with id to each template', function() {
        var templateString = '';
        grunt.file.recurse('templates/', function(abspath, rootdir, subdir, filename){
            var intro = '<script type="text/html" id="/' + rootdir.replace('/','') + '/' + subdir.replace('/','') + '/' + filename.replace('.html','') + '">\n';
            var content = grunt.file.read(abspath);
            var outro = '</script>\n';
            templateString += intro + content + outro;
        });
        grunt.file.write('tmp/templates.html', templateString);
    });*/


    /*** NAMED TASKS ***/
    grunt.registerTask('release', [ 'ts', 'less:min', 'shell:compile_templates', 'concat:dev', 'uglify:dist', 'index' ]);
    grunt.registerTask('debug', [ 'ts', 'less:dev', 'shell:compile_templates', 'concat:dev',  'index_debug' ]);
    grunt.registerTask('devel', [ 'debug', 'server', 'unittests', 'reload', 'watch' ]);
    grunt.registerTask('unittests', [ 'copy:unittests' ]);

    grunt.registerTask('server', [ 'http-server:dev' ]);

    grunt.registerTask('distrelease',[
        'release', 'debug',
        'copy:release', 'copy:release_debug', 'copy:release_templates',
        'shell:zip_release'
    ]);
    // Default task
    grunt.registerTask('default', [ 'release', 'debug', 'unittests' ] );
};
