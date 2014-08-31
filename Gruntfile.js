var createIndex = function (grunt, taskname) {
    'use strict';
    var conf = grunt.config('index')[taskname],
        tmpl = grunt.file.read(conf.template);

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
            'js/logging.js',
            'js/modules.js',
            'ts_compiled/mdwiki_ts.js',
            'js/main.js',
            'js/stage.js',
            'js/util.js',
            'js/basic_skeleton.js',
            'js/bootstrap.js',
            'js/gimmicker.js',

            // gimmicks
            'js/gimmicks/alerts.js',
            'js/gimmicks/colorbox.js',
            // 'js/gimmicks/carousel.js',
            'js/gimmicks/disqus.js',
            'js/gimmicks/editme.js',
            'js/gimmicks/facebooklike.js',
            'js/gimmicks/forkmeongithub.js',
            'js/gimmicks/gist.js',
            'js/gimmicks/googlemaps.js',
            'js/gimmicks/iframe.js',
            'js/gimmicks/prism.js',
            'js/gimmicks/math.js',
            // // 'js/gimmicks/leaflet.js',
            'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js',
            'js/gimmicks/yuml.js'
        ],

        // REMEMBER:
        // * ORDER OF FILES IS IMPORTANT
        // * ALWAYS ADD EACH FILE TO BOTH minified/unminified SECTIONS!
        cssFiles: [
            'tmp/main.min.css',
        ],
        jsFiles: [
            'bower_components/jquery/jquery.min.js',
            'extlib/js/jquery.colorbox.min.js',
            'extlib/js/prism.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js'
        ],
        // for debug builds use unminified versions:
        unminifiedCssFiles: [
            'tmp/main.css'
        ],
        unminifiedJsFiles: [
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js',
            'extlib/js/prism.js',
            'extlib/js/jquery.colorbox.js'
        ],

        typescript: {
            base: {
                src: ['js/ts/**/*.ts'],
                dest: 'ts_compiled/mdwiki_ts.js',
                options: {
                    //module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: '/js/ts/',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: false,
                }
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
        /* make it use .jshintrc */
        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    marked: true,
                    google: true,
                    hljs: true,
                    /* leaflet.js*/
                    L: true,
                    console: true,
                    MDwiki: true,
                    Prism: true,
                    alert: true
                }
            },
            /*gruntfile: {
                src: 'Gruntfile.js'
            },*/
            js: {
                src: ['js/*.js', 'js/**/*.js', '!js/marked.js']
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
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'js/*.js',
                'js/**/*.js',
                'js/ts/**/*.ts',
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
                root:'dist/',
                port: 1026,
                host: "127.0.0.1",
                cache: 1,
                showDir : true,
                autoIndex: true,
                defaultExt: "html",
                runInBackground: true
            },
            'unittests': {
                root:'./',
                port: 1027,
                host: "127.0.0.1",
                cache: 0,
                showDir : true,
                autoIndex: true,
                defaultExt: "html",
                runInBackground: false
            }
        }
    });

    grunt.registerTask('index', 'Generate mdwiki.html, inline all scripts', function() {
        createIndex(grunt, 'release');
    });
    grunt.registerTask('release', [ 'jshint', 'typescript', 'less:min', 'concat:dev', 'uglify:dist', 'index' ]);

    /* Debug is basically the releaes version but without any minifing */
    grunt.registerTask('index_debug', 'Generate mdwiki-debug.html, inline all scripts unminified', function() {
        createIndex(grunt, 'debug');
    });
    grunt.registerTask('debug', [ 'jshint', 'typescript', 'less:dev', 'concat:dev', 'index_debug' ]);
    grunt.registerTask('devel', [ 'debug', 'server', 'reload', 'watch' ]);
    grunt.registerTask('unittests', [ 'copy:unittests', 'http-server:unittests' ]);

    grunt.registerTask('server', [ 'http-server:dev' ]);

    grunt.registerTask('distrelease',[
        'release', 'debug',
        'copy:release', 'copy:release_debug', 'copy:release_templates',
        'shell:zip_release'
    ]);
    // Default task
    grunt.registerTask('default', [ 'release', 'debug' ] );
};
