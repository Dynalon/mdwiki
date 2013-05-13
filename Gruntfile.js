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
            'js/main.js',
            'js/basic_skeleton.js',
            'js/bootstrap.js',
            'js/gimmicker.js',

            // gimmicks
            'js/gimmicks/alerts.js',
            'js/gimmicks/colorbox.js',
            'js/gimmicks/disqus.js',
            //'js/gimmicks/facebooklike.js',
            'js/gimmicks/forkmeongithub.js',
            //'js/gimmicks/github_gist.js',
            'js/gimmicks/googlemaps.js',
            'js/gimmicks/image_linker.js',
            //'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js'
        ],

        // files that we include in the fat release (basically everything)
        externalJsFilesFat: [
            'extlib/js/jquery-1.8.3.min.js',
            'extlib/js/jquery.colorbox.min.js',
            'extlib/js/bootstrap-2.1.0.min.js'
        ],
        externalCssFilesFat: [
            'extlib/css/bootstrap-combined-2.1.0.min.css',
            'extlib/css/colorbox.css'
        ],

        // files that we include in the slim release (only stuff not on CDN)
        externalCssFilesSlim: [
            'extlib/css/colorbox.css'
        ],
        externalJsFilesSlim: [
            'extlib/js/jquery.colorbox.min.js'
        ],

        // references we add in the slim release (refs to CDN locations)
        externalJsRefsSlim: [
            'ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
            'netdna.bootstrapcdn.com/twitter-bootstrap/2.1.0/js/bootstrap.min.js'
        ],
        externalCssRefsSlim: [
            'netdna.bootstrapcdn.com/twitter-bootstrap/2.1.0/css/bootstrap-combined.min.css'
        ],

        index: {
            slim: {
                src: 'index-slim.tmpl',
                dest: 'dist/index.html'
            },
            fat: {
                src: 'index-fat.tmpl',
                dest: 'dist/index-full.html'
            }
        },

        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: true
            },
            dev: {
                src: '<%= ownJsFiles %>',
                dest: 'dist/mdwiki.js'
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
        livereload: {
            port: 35729 // Default livereload listening port.
        },
        reload: {
            port: 35729,
            liveReload: {}
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
                    console: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                src: ['js/*.js', 'js/**/*.js', '!js/marked.js']
            }
        },
        lib_test: {
            src: ['lib/**/*.js', 'test/**/*.js']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile', 'release-slim']
            },
            js: {
                files: ['js/*.js', 'js/**/*.js'],
//                files: ['js/basic_skeleton.js'],
                tasks: ['release-slim' ]
            },
            tmpl: {
                files: ['index-*.tmpl'],
                tasks: ['release-slim']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-livereload');

//    grunt.task.run('livereload-start');
    grunt.registerTask('index_slim', 'Generate index.html depending on configuration', function() {
        var conf = grunt.config('index').slim,
        tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));
        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

    grunt.registerTask( 'index_fat', 'Generate index.html depending on configuration', function() {
        var conf = grunt.config('index').fat,
        tmpl = grunt.file.read(conf.src);

        grunt.file.write(conf.dest, grunt.template.process(tmpl));
        grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
    });

    grunt.registerTask('dev', [ 'release-slim']);
    grunt.registerTask('release-slim', [ 'jshint', 'concat:dev', 'index_slim']);
    grunt.registerTask('release-fat', [ 'jshint', 'concat:dev', 'uglify:dist', 'index_fat']);
    grunt.registerTask('all', ['release-slim', 'release-fat' ]);

    // Default task.
    grunt.registerTask('default', 'all');
};
