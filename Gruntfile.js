var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
};
/*global module:false*/
module.exports = function(grunt) {
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
            'js/gimmicks/disqus.js',
            'js/gimmicks/facebooklike.js',
            'js/gimmicks/forkmeongithub.js',
            //'js/gimmicks/github_gist.js',
            'js/gimmicks/gist.js',
            'js/gimmicks/googlemaps.js',
            'js/gimmicks/image_linker.js',
            'js/gimmicks/leaflet.js',
            'js/gimmicks/twitter.js',
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
            'netdna.bootstrapcdn.com/twitter-bootstrap/2.1.0/css/bootstrap-combined.min.css',
//            'netdna.bootstrapcdn.com/bootswatch/2.3.1/slate/bootstrap.min.css',
//            'www.3solarmasses.com/retriever-bootstrap/css/retriever.css'
//            '3solarmasses.com/corgi-bootstrap/css/corgi.css'
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
                tasks: [ 'dev', 'livereload' ]
            },
            js: {
                files: ['js/*.js', 'js/**/*.js'],
//                files: ['js/basic_skeleton.js'],
                tasks: [ 'dev', 'livereload' ]
            },
            tmpl: {
                files: ['index-slim.tmpl', 'index-fat.tmpl'],
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-regarde');

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

    grunt.registerTask( 'tests', 'Generate tests.html', function() {
        var tmpl = grunt.file.read('tests/test.html');

        grunt.file.write('dist/test.html', grunt.template.process(tmpl));
        grunt.log.writeln('Generated test.html');
    });

    grunt.registerTask('dev', [ 'release-slim', 'release-fat' ]);
    grunt.registerTask('release-slim', [  'jshint', 'concat:dev', 'uglify:dist', 'index_slim']);
    grunt.registerTask('release-fat', [ 'jshint', 'concat:dev', 'uglify:dist', 'index_fat']);
    grunt.registerTask('all', ['release-slim', 'release-fat']);
    grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);


    // Default task.
    grunt.registerTask('default', 'all');
};
