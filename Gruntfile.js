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
            // 'js/gimmicks/highlight.js',
            'js/gimmicks/iframe.js',
            'js/gimmicks/math.js',
            // // 'js/gimmicks/leaflet.js',
            'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js'
        ],

        // REMEMBER: ORDER OF FILES IS IMPORTANT
        cssFiles: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'extlib/css/colorbox.css',
        ],
        jsFiles: [
            'bower_components/jquery/jquery.min.js',
            'extlib/js/jquery.colorbox.min.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js'
        ],
        // for debug builds use unminified versions:
        unminifiedCssFiles: [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'extlib/css/colorbox.css'
        ],
        unminifiedJsFiles: [
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/bootstrap/js/dropdown.js',
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

        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: true
            },
            dev: {
                src: '<%= ownJsFiles %>',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dev.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
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
            tasks: ['devel']
        },
        reload: {
            port: 35729,
            liveReload: {}
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-reload');

    grunt.registerTask('index', 'Generate mdwiki.html, inline all scripts', function() {
        createIndex(grunt, 'release');
    });
    grunt.registerTask('release', [ 'jshint', 'typescript', 'concat:dev', 'uglify:dist', 'index' ]);

    /* Debug is basically the releaes version but without any minifing */
    grunt.registerTask('index_debug', 'Generate mdwiki-debug.html, inline all scripts unminified', function() {
        createIndex(grunt, 'debug');
    });
    grunt.registerTask('debug', [ 'jshint', 'typescript', 'concat:dev', 'index_debug' ]);

    grunt.registerTask('devel', [ 'debug', 'reload', 'watch' ]);

    grunt.registerTask('distrelease',[
        'release', 'debug',
        'copy:release', 'copy:release_debug', 'copy:release_templates',
        'shell:zip_release'
    ]);
    // Default task
    grunt.registerTask('default', [ 'release', 'debug' ] );
};
