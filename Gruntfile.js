module.exports = function ( grunt ) {

	var jsFiles = [
		'src/js/ali.js',
		'src/js/core/aria.js',
		'src/js/core/ali.js',
		'src/js/core/interaction.js',
		'src/js/interactions/accordion.js'
	];

	grunt.initConfig(
		{
			pkg : grunt.file.readJSON( 'package.json' ),


			jshint : {
				options     : {
					curly     : true,
					browser   : true,
					forin     : true,
					immed     : true,
					latedef   : true,
					newcap    : true,
					undef     : true,
					strict    : true,
					smarttabs : true,
					sub       : true,
					globals   : {
						console : true,
						jQuery  : true
					}
				},
				beforeconcat: jsFiles//,
				//afterconcat: ['dist/ali.js']
			},

			concat : {
				options : {
					separator : grunt.util.linefeed + ';' + grunt.util.linefeed
				},
				dist    : {
					src  : jsFiles,
					dest : 'dist/ali.js'
				}
			},

			uglify : {
				options : {
					sourceMap        : true,
					preserveComments : /(?:^!|@(?:license|preserve|cc_on))/
				},
				main    : {
					files : {
						'dist/ali.min.js' : 'dist/ali.js'
					}
				}
			},

			// CSS / SASS
			sass : {
				main : {
					options : {
						style : 'expanded'
					},
					files   : {
						'dist/ali.css' : 'src/scss/ali.scss'
					}
				}
			},

			autoprefixer : {
				main : {
					options : {
						browsers : [ 'last 4 versions', 'ie 10', 'ie 11' ]
					},

					files : {
						'dist/ali.css' : 'dist/ali.css'
					}
				}
			},

			cssmin : {
				main : {
					options : {
						sourceMap           : false,
						keepSpecialComments : 1
					},
					files   : {
						'dist/ali.min.css' : 'dist/ali.css'
					}
				}
			},

			watch : {
				javascript : {
					files   : [ 'src/js/*.js', 'src/js/**/*.js' ],
					tasks   : [ 'jshint', 'concat', 'uglify' ],
					options : {
						spawn : false
					}
				},
				sass       : {
					files   : [ 'src/scss/*.scss', 'src/scss/**/*.scss' ],
					tasks   : [ 'sass', 'autoprefixer', 'cssmin' ],
					options : {
						spawn : false
					}
				}
			}

		} );

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'default', [ 'sass', 'autoprefixer', 'cssmin', 'jshint', 'concat', 'uglify' ] );
};