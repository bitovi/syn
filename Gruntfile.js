module.exports = function (grunt) {

	grunt.initConfig({
		copy: {
			latest: {
				files: [{
					src: ['funcunit.js'],
					dest: 'dist/latest/',
					expand: true,
					cwd: 'funcunit/dist/'
				}]
			},

			example: {
				files: [{
					src: ['funcunit.js'],
					dest: 'examples/resources/',
					expand: true,
					cwd: 'funcunit/dist/'
				}]
			},

			jasmine: {
				files: [{
					src: ['jasmine-html.js',
						'jasmine.js',
						'jasmine.css',
						'lib/qunit/qunit/*',
						'lib/jquery/jquery.js'],
					dest: 'examples/resources/',
					expand: true,
					cwd: 'lib/jasmine/lib/jasmine-core/'
				}]
			},

			qunit: {
				files: [{
					src: ['*'],
					dest: 'examples/resources/',
					expand: true,
					cwd: 'lib/qunit/qunit/'
				}]
			},

			jquery: {
				files: [{
					src: ['jquery.js'],
					dest: 'examples/resources/',
					expand: true,
					cwd: 'lib/jquery/'
				}]
			}
		},

		compress: {
			main: {
				options: {
					archive: 'dist/examples.zip'
				},
				files: [{
					src: ['examples/**'], dest: 'dist/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['copy']);

};