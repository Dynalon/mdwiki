var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
    'use strict';
    return connect.static(path.resolve(point));
};
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
            name: 'mdwiki',
            version: '0.0.1'
        },

        ownJsFiles: [
            'js/marked.js',
            'js/init.js',
            'js/logging.js',
            'js/stage.js',
            'js/main.js',
            'js/util.js',
            'js/modules.js',
            'js/basic_skeleton.js',
            'js/bootstrap.js',
            'js/gimmicker.js',

            // gimmicks
            'js/gimmicks/alerts.js',
            'js/gimmicks/colorbox.js',
            'js/gimmicks/carousel.js',
            'js/gimmicks/disqus.js',
            'js/gimmicks/facebooklike.js',
            'js/gimmicks/forkmeongithub.js',
            //'js/gimmicks/github_gist.js',
            'js/gimmicks/gist.js',
            'js/gimmicks/googlemaps.js',
            'js/gimmicks/image_linker.js',
            'js/gimmicks/leaflet.js',
            'js/gimmicks/themechooser.js',
            'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js'
        ],

        // files that we always inline (stuff not available on CDN)
        internalCssFiles: [
            'extlib/css/colorbox.css'
        ],
        // ONLY PUT ALREADY MINIFIED FILES IN HERE!
        internalJsFiles: [
            'extlib/js/jquery.colorbox.min.js'
        ],

        // files that we inline in the fat release (basically everything)
        // ONLY PUT ALREADY MINIFIED FILES IN HERE!
        externalJsFiles: [
            'extlib/js/jquery-1.8.3.min.js',
            'extlib/js/bootstrap-2.3.2.min.js'
        ],
        externalCssFiles: [
            'extlib/css/bootstrap-combined-2.3.2.min.css'
        ],

        // references we add in the slim release (stuff available on CDN locations)
        externalJsRefs: [
            'ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
            'netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js'
        ],
        externalCssRefs: [
            'netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css',
//            'netdna.bootstrapcdn.com/bootswatch/2.3.1/slate/bootstrap.min.css',
//            'www.3solarmasses.com/retriever-bootstrap/css/retriever.css'
//            '3solarmasses.com/corgi-bootstrap/css/corgi.css'
        ],

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
            fat: {
                template: 'index.tmpl',
                dest: 'dist/index-fat.html'
            },
            slim: {
                template: 'index.tmpl',
                dest: 'dist/index-slim.html'
            },
            devel: {
                template: 'index.tmpl',
                dest: 'dist/index-devel.html'
            }
        },
        jshint: {
            options: {
                curly: true,
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
                    /* leaflet.js*/
                    L: true,
                    console: true
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
         // Configuration to be run (and then tested)
        regarde: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [ 'devel', 'livereload' ]
            },
            js: {
                files: ['js/*.js', 'js/**/*.js'],
//                files: ['js/basic_skeleton.js'],
                tasks: [ 'devel', 'livereload' ]
            },
            tmpl: {
                files: ['index.tmpl'],
                tasks: ['devel', 'livereload']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-regarde');

    grunt.registerTask('index_slim', 'Generate slim index.html, most scripts on CDN', function() {
        createIndex(grunt, 'slim');
    });

    grunt.registerTask('index_fat', 'Generate fat index.html, inline all scripts', function() {
        createIndex(grunt, 'fat');
    });

    grunt.registerTask('index_devel', 'Generate devel index.html', function() {
        createIndex(grunt, 'devel');
    });

    grunt.registerTask('release-slim', [  'jshint', 'concat:dev', 'uglify:dist', 'index_slim']);
    grunt.registerTask('release-fat', [ 'jshint', 'concat:dev', 'uglify:dist', 'index_fat']);
    grunt.registerTask('devel', [ 'jshint', 'concat:dev', 'index_devel']);
    grunt.registerTask('all', ['devel', 'release-slim', 'release-fat']);

    // Default task.
    grunt.registerTask('watch', [ 'devel', 'release-slim', 'release-fat', 'livereload-start', 'regarde' ]);
    grunt.registerTask('default', [ 'watch' ]);

};
