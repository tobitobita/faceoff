module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8088
//                    , protocol : 'https'
//                    , keepalive : true
                    , base: 'htdocs'
                }
            }
        }
        , clean: {
            html : ["./htdocs/*"]
        }
        , concat: {
			js: {
				src: [
                        './bower_components/jquery/jquery.min.js'
                        , './bower_components/jquery.cookie/jquery.cookie.js'
                        , './bower_components/bootstrap/dist/js/bootstrap.min.js'
                        , './self_downloads/xml2json/js/jquery.xml2json.js'
                        , './self_downloads/nifty/ncmb-1.0.0.min.js'
                        , './src/js/faceoff.js'
                    ],
				dest: './htdocs/js/faceoff.js'
			}
            ,
			css: {
				src: [
                        './bower_components/bootstrap/dist/css/bootstrap.min.css'
                        , './bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
                        , './src/css/common.css'
                    ],
				dest: './htdocs/css/faceoff.css'
			}
		}
        , copy: {
            dist: {
                files: [
                    {
                        src:'./bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', dest: './htdocs/fonts/glyphicons-halflings-regular.eot'
                    }
                    , {
                        src:'./bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', dest: './htdocs/fonts/glyphicons-halflings-regular.svg'
                    }
                    , {
                        src:'./bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', dest: './htdocs/fonts/glyphicons-halflings-regular.ttf'
                    }
                    , {
                        src:'./bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', dest: './htdocs/fonts/glyphicons-halflings-regular.woff'
                    }
                    , {
                        src:'./src/image/preloader.gif', dest: './htdocs/image/preloader.gif'
                    }
                    , {
                        src:'./bower_components/jquery/jquery.min.map', dest: './htdocs/js/jquery.min.map'
                    }
                    , {
                        src:'./src/js/login.js', dest: './htdocs/js/login.js'
                    }
                    , {
                        src:'./src/js/dashboard.js', dest: './htdocs/js/dashboard.js'
                    }
                    , {
                        src:'./src/js/add.js', dest: './htdocs/js/add.js'
                    }
                ]
            }
        }
        , bake: {
            build: {
//                options: {
//                    basePath : '/'
//                }
                files: {
                    './htdocs/index.html' : './src/index.html'
                    , './htdocs/success.html' : './src/success.html'
                    , './htdocs/dashboard.html' : './src/dashboard.html'
                    , './htdocs/add.html' : './src/add.html'
                }
            }
        }
//		,
//        uglify: {
//            basic: {
//                files: {
//                    'js/std.min.js': ['js/std.concat.js']
//                }
//            }
//        }
        , watch: {
            files: [
                'bake_template/*'
                , 'src/*'
                , 'src/js/*'
                , 'src/css/*'
                , 'src/image/*'
            ]
            , tasks: [
                'clean'
                , 'copy'
                , 'concat'
                , 'bake'
            ]
    }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bake');
//    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', [
    	'clean'
    	, 'copy'
    	, 'concat'
    	, 'bake'
    	, 'connect'
//    	, 'cssmin'
//    	, 'uglify'
        , 'watch'
    ]);
}