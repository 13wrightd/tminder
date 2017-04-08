'use strict';

module.exports = function(grunt){
	grunt.config.init({
		concurrent: {
			target: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js'
			}
		},
		watch: {
			options: {
				livereload: 9000
			},
			scripts: {
				files: ['public/core/*.styl'],
				tasks: ['stylus']
			}
		}
	});

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-stylus');

	grunt.registerTask('default', ['concurrent']);

};