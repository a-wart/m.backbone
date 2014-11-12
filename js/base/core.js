/*global noty*/
// Основной модуль приложения
define([
	// Собираем все зависимости приложения
	'backbone',
	'resources',
	'shims',
	'jquery-plugins-init',
	'backbone-overrides',
	'handlebars',
	'handlebars-helpers',
], function(Backbone, Resources) {

	// TODO: по идее нужно всё последующее добро добавлять в прототип
	var Core = {
		utils: {}
	};

	Core.resources = Resources;
	Core.utils.notify = function(params) {
		params.dismissQueue = true;
		noty(params);
	};

	// Возвращает скомпилированный шаблон по имени
	Core.utils.template = function(templateName) {
		return function(data) {
			return window.TPL[templateName](data || {});
		};
	};

	// Проталкиваем изменение window.location через
	// Backbone.history.navigate
	function handleLocationChange(url) {
		// Перестраховываемся от '/' в начале url (ломает
		// Backbone.router.navigate)
		if (url.charAt(0) == '/') {
			url = url.substr(1, url.length);
		}

		Core.routes && Core.routes.navigate(url, { trigger: true });
	}

	// Запускаем собственный обработчик кликов по ссылкам
	// и сабмитов форм, используя pushState браузера и fallback
	// до хэша в случае, если pushState не поддерживается
	$(document)
		.delegate('a:not(.j-no-push-state)', 'click', function(event) {
			var link = $(this),
				href = link.attr('href'),
				protocol = this.protocol + '//';

			if (href) {
				// Если ссылка внутренняя тогда прогоняем её через Backbone.history
				if (href.substring(0, protocol.length) != protocol) {
					// Если у ссылки стоит класс j-force-reload и мы уже находимся на той же странице что и в ссылке
					// то обнуляем Backbone.history.fragment для того чтобы произошло обновление страницы
					if (link.hasClass('j-force-reload') && Backbone.history.fragment == Backbone.history.getFragment(href)) {
						Backbone.history.fragment = null;
					}

					event.preventDefault();
					handleLocationChange(href);
				} else {
					// Проверяем если в модели урла выставлен домен и он совпадает с доменом внешней ссылки,
					// тогда обрезаем в ссылке часть с доменом и прогоняем её через роутинг.
					// Это сделано для того, чтобы в режиме iframe у пользователя все ссылки были не с нашего домена, а с партнерского.
					var domain = Core.url && Core.url.get('domain');

					if (domain && href.search(domain) !== -1) {
						event.preventDefault();
						handleLocationChange(href.replace(domain, ''));
					}
				}
			}
		})
		.delegate('form', 'submit', function(event) {
			var action = $(this).attr('action');

			event.preventDefault();

			handleLocationChange(action);
		});

	// Сериализует поля формы в объект
	Core.utils.serializeToObject = function(form) {
		var obj = {},
			arr = form.serializeArray();

		for (var i = 0, length = arr.length, arrItem; i < length; i++) {
			arrItem = arr[i];

			if (obj[arrItem.name]) {
				if (!obj[arrItem.name].push) {
					obj[arrItem.name] = [obj[arrItem.name]];
				}

				obj[arrItem.name].push(arrItem.value || '');
			} else {
				obj[arrItem.name] = arrItem.value || '';
			}
		}

		return obj;
	};

	/**
	 * Возвращает время в милисекундах в формате UTC (с учётом смещения по таймзоне)
	 *
	 * @param localTime
	 */
	Core.utils.getUTCTime = function (localTime) {
		return localTime ? (localTime - new Date(localTime).getTimezoneOffset() * 60 * 1000) : '';
	};

	return Core;

});
