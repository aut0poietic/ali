module.exports = function ( grunt ) {

	var es6Files = [
		'src/js/ali.es6',
		'src/js/core/ali.es6',
		'src/js/core/aria.es6',
		'src/js/core/interaction.es6',
		'src/js/core/multipartinteraction.es6',
		'src/js/interactions/accordion.es6'
	];

	grunt.initConfig(
		{
			pkg : grunt.file.readJSON( 'package.json' ),

			concat : {
				options : {
					separator : grunt.util.linefeed + ';' + grunt.util.linefeed
				},
				dist    : {
					src  : es6Files,
					dest : '.tmp/ali.es6'
				}
			},

			babel : {
				es6 : {
					options : {
						presets : [
							'babel-preset-es2015'
						]
					},
					files   : {
						'dist/ali.js' : '.tmp/ali.es6'
					}

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
					files   : [ 'src/js/*.es6', 'src/js/**/*.es6' ],
					tasks   : [ 'concat', 'babel', 'uglify' ],
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

	grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'default', [ 'sass', 'autoprefixer', 'cssmin', 'concat', 'babel', 'uglify' ] );
};