module.exports = function ( grunt ) {


	grunt.initConfig(
		{
			pkg : grunt.file.readJSON( 'package.json' ),

			babel : {
				es6 : {
					options : {
						presets   : [
							'babel-preset-es2015'
						]
					},
					files   : [
						{
							expand : true,
							src    : [ 'src/js/**/*.es6' ],
							ext    : '.js'
						}
					]
				}
			},

			concat : {
				options : {
					separator : ';'
				},
				dist    : {
					src  : [
						'src/js/ali.js',
						'src/js/core/aria.js',
						'src/js/core/interaction.js',
						'src/js/interactions/accordion.js'
					],
					dest : 'dist/ali.js'
				}
			},

			jshint : {
				options     : {
					"asi"       : true,
					"browser"   : true,
					"eqeqeq"    : true,
					"eqnull"    : true,
					"expr"      : true,
					"jquery"    : true,
					"latedef"   : true,
					"nonbsp"    : true,
					"strict"    : true,
					"undef"     : true,
					"unused"    : true,
					"smarttabs" : true,

					globals : {
						console : true,
						jQuery  : true
					}
				},
				afterconcat : [ 'src/js/*.js' ]
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
					tasks   : [ /*'jshint',*/ 'babel', 'concat', 'uglify' ],
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

	grunt.registerTask( 'default', [ 'sass', 'autoprefixer', 'cssmin', /*'jshint',*/ 'babel', 'concat', 'uglify' ] );
};