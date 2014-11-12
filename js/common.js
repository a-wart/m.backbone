/*global require*/
require.config({
	baseUrl: '/js',
	waitSeconds: 15,

	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		rivets: {
			deps: ['backbone'],
			exports: 'rivets'
		},
		'backbone-overrides': ['backbone'],
		'handlebars-helpers': ['handlebars'],

		// Зависимости плагинов jQuery
		jqueryUI: ['jquery'],
		fancybox: ['jquery'],
		mockJSON: ['jquery'],
		'twitter-bootstrap': ['jquery'],

		geo: {
			exports: 'geo_position_js'
		},

		fileuploader: {
			deps: ['jquery'],
			exports: 'qq'
		},

		objectid: {
			exports: 'ObjectId'
		},

		cookie: {
			exports: 'Cookie'
		}
	},

	paths: {
		app: './',

		// Application Core
		core: 'base/core',

		// Libs
		text: 'base/libs/text', // RequireJS Text extension
		jquery: 'base/libs/jquery',
		underscore: 'base/libs/lodash', // Underscore (Lo-Dash - http://lodash.com)
		backbone: 'base/libs/backbone',
		handlebars: 'base/libs/handlebars',
		rivets: 'base/libs/rivets',

		// Extensions
		'backbone-overrides': 'base/extensions/backbone-overrides',
		'handlebars-helpers': 'base/extensions/handlebars-helpers',
		'jquery-plugins-init': 'base/extensions/jquery-plugins-init',

		// Utils
		shims: 'base/utils/shims',
		resources: 'base/utils/resources',

		// jQuery Plugins
		jqueryUI: 'base/libs/jquery-plugins/jquery-ui',
		mockJSON: 'base/libs/jquery-plugins/jquery.mockjson',
	}
});