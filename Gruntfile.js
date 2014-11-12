/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	// Конфигурация проекта
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Параметры для встроенного сервера
		connect: {
			server: {
				options: {
					port: 9001,
					base: './',
					keepalive: true,
					livereload: true,
					open: {
						target: 'http://localhost:9001',
						appName: 'open',
						callback: function() {}
					}
				}
			}
		},

		// Файлы приложения
		app: {
			scripts: {
				base: [
					'js/config.js',
					'js/base/extensions/*.js',
					'js/base/utils/*.js',
					'js/base/core.js'
				],
				libs: [
					'js/base/libs/**/*.js'
				],
				common: [
					'<%= app.scripts.libs %>',
					'<%= app.scripts.base %>'
				],
				shared: [
					'js/shared/**/*.js'
				],
				apps: [
					'js/apps/*.js',
					'js/widgets/**/*.js'
				],
				index: [
					'js/apps/index/*.js',
					'js/widgets/index/**/*.js'
				]
			},
			stylesheets: [
				'scss/**/*.scss'
			],
			templates: {
				shared: [
					'js/shared/**/templates/*.html'
				],
				index: [
					'js/apps/index/templates/*.html',
					'js/widgets/index/**/templates/*.html'
				]
			},
			specs: [
				'spec/js/*.js'
			]
		},

		// watch таска
		watch: {
			templates: {
				files: [
					'<%= app.templates.shared %>',
					'<%= app.templates.index %>'
				],
				tasks: 'handlebars'
			},
			scss: {
				files: [
					'<%= app.stylesheets %>'
				],
				tasks: 'compass:watch'
			}
		},

		// compass
		compass: {
			// Таск для слежения за *.scss файлами и сборкой
			// их в css-файлы на лету
			watch: {
				options: {
					sassDir: './scss/',
					cssDir: './css/',
					outputStyle: 'expanded',
					noLineComments: true,
					imagesDir: './img/',
					fontsDir: './fonts/',
					relativeAssets: true
				}
			},
			// Таск для сборки SASS в CSS (для тестовой среды)
			dev: {
				options: {
					sassDir: './scss/',
					cssDir: './css/',
					outputStyle: 'expanded',
					noLineComments: false,
					imagesDir: './img/',
					fontsDir: './fonts/',
					relativeAssets: true,
					force: true
				}
			},
			// Таск для сборки и компиляции SASS в CSS (для продакшн среды)
			prod: {
				options: {
					sassDir: './scss/',
					cssDir: './css/',
					outputStyle: 'compressed',
					noLineComments: false,
					imagesDir: './img/',
					fontsDir: './fonts/',
					relativeAssets: true,
					force: true
				}
			}
		},

		// Склейка и минификация JS файлов
		requirejs: {
			// Общие опции для всех модулей
			options: {
				paths: {
					requireLib: 'base/require',
					// Исключаем забутстрапленые модули из сборки
					'bootstrap/categories': 'empty:'

				},
				baseUrl: 'js/',
				preserveLicenseComments: false,
				findNestedDependencies: true,
				mainConfigFile: 'js/common.js',
				optimize: 'uglify',
				include: ['requireLib']
			},
			// Модули
			index: {
				options: {
					name: 'index',
					out: 'min_js/index.js'
				}
			}
		},

		// Прекомпиляция шаблонов Handlebars
		handlebars: {
			compile: {
				options: {
					amd: true,
					wrapped: true,
					namespace: 'TPL',
					processName: function(filePath) {
						// Формируем имя шаблона следующим образом:
						// "js/shared/controls/templates/checkbox.html" => "controls:checkbox"
						// "js/widgets/index/ad_block/templates/ad_form.html" => "ad_block:ad_form"
						return filePath.replace(/^js\/(?:\w+\/)*(\w+)\/templates\/(\w+)\.html/gi, '$1:$2');
					}
				},
				files: {
					'js/apps/templates/index.tpl.js': [
						'<%= app.templates.shared %>',
						'<%= app.templates.index %>'
					]
				}
			}
		},

		jasmine: {
			all: {
				src: ['spec/SpecRunner.html'],
				timeout: 3000,
				errorReporting: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-connect');

	// Задача по умолчанию
	grunt.registerTask('default', ['build', 'connect', 'watch']);

	// Общая задача для сборки статики
	// (собираем шаблоны, собираем и минифицируем стили)
	grunt.registerTask('build', ['handlebars', 'compass:dev']);

	// Общая задача для сборки статики на продакшн
	// (собираем шаблоны, минифицируем их вместе с остальными
	// скриптами, собираем и минифицируем стили)
	grunt.registerTask('release', ['handlebars', 'requirejs', 'compass']);

	// Запускаем сервер по команде `grunt launch`
	grunt.registerTask('launch', ['connect', 'watch']);
};
