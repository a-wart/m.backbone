/*global require*/
require(['common'], function() {
	require(['base/libs/domReady!'], function() {
		require([
			'core',
			'widgets/index/form/main',
			'widgets/index/tickets/main',

			// Шаблоны
			'apps/templates/index.tpl'
		], function(Core, FormWidget, TicketsWidget) {
			var Workspace = Backbone.Router.extend({
				defaultPage: '/',
				routes: {
					'': 'form',
					'searches': 'search',
					'searches/:route': 'search',
					':page': 'processWrongRoute'           // обрабатываем неправильные роуты
				},

				form: function() {
					new FormWidget({
						container: '.b-form-container'
					});
				},

				search: function(route) {
					new TicketsWidget();
				},

				processWrongRoute: function() {
					this.navigate(this.defaultPage, true);
				}
			});

			Core.routes = new Workspace();
			Core.appName = 'index';

			Backbone.history.start({
				pushState: true,
				path: '/'
			});

			// Убираем класс добавляющий спинер в основной контейнер
			$('.l-container--loading').removeClass('l-container--loading');
		});
	});
});
