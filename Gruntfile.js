module.exports = function ( grunt ) {


	var aliConfig = grunt.file.readJSON( 'ali.config.json' );

	var templates = [
		'src/html/feedback.html',
		'src/html/feedbackContainer.html'
	];

	var jsFiles = [
		'src/js/ali.js',
		'src/js/core/aria.js',
		'src/js/vendor/mustache.min.js',
		'src/html/templates.js',
		'src/js/core/feedback.js',
		'src/js/core/interaction.js',
	];

	if ( aliConfig.include.dialog ) {
		jsFiles.push( 'src/js/core/dialog.js' );
		templates.push( 'src/html/dialog.html' );
	}

	if ( aliConfig.include.accordion ) {
		jsFiles.push( 'src/js/interactions/accordion.js' );
	}

	if ( aliConfig.include.tab ) {
		jsFiles.push( 'src/js/interactions/tab-control.js' );
	}

	if ( aliConfig.include.answerSet ) {
		jsFiles.push( 'src/js/interactions/answer-set.js' );
	}

	grunt.initConfig(
		{
			pkg : grunt.file.readJSON( 'package.json' ),


			htmlConvert : {
				options       : {
					base   : 'src/html/',
					module : 'htmlTemplates',
					rename : function ( moduleName ) {
						return moduleName.replace( '.html', '' );
					}
				},
				htmlTemplates : {
					src  : templates,
					dest : 'src/html/templates.js'
				}
			},


			jshint : {
				options      : {
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
						console  : true,
						Mustache : true,
						jQuery   : true
					}
				},
				beforeconcat : [ 'src/js/*.js', 'src/js/**/*.js', '!src/js/*.min.js', '!src/js/**/*.min.js' ]
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
				},
				html       : {
					files   : [ 'src/html/*.html', 'src/html/**/*.html' ],
					tasks   : [ 'htmlConvert', 'jshint', 'concat', 'uglify' ],
					options : {
						spawn : false
					}
				}
			}

		} );

	require( 'load-grunt-tasks' )( grunt );

	grunt.registerTask( 'default', [ 'sass', 'autoprefixer', 'cssmin', 'htmlConvert', 'jshint', 'concat', 'uglify' ] );
};