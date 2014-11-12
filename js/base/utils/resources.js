// Библиотека управления ресурсами
// В любом месте приложения мы можем "запросить" ресурс
// core.resources.iCanHaz('ResourceName').then(function(data) {
//   // используем "data"
// });
//
// Зарегистрировать же ресурс можно в совершенно произвольное время:
// core.resources.register('ResourceName');
//
define(['jquery', 'underscore'], function() {
	var
		// Здесь будут храниться промисы ресурсов
		_savedResources = {},

		// Создаёт deferred на ресурс
		ensureResource = function(resourceName) {
			return _savedResources[resourceName] = _savedResources[resourceName] || $.Deferred();
		},

		// Публичный API
		resources = {

			// Регистрирует ресурс по имени, разрешая его
			// переданным объектом `resource`
			register: function(resourceName, resource) {
				ensureResource(resourceName).resolve(resource);

				return this;
			},

			// Запрашивает ресурс по имени. Можно запросить несколько ресурсов,
			// перечислив их имена через пробел
			// Возвращает промис на ресурс (или на несколько ресурсов). Промис будет
			// разрешён как только все запрошенные ресурсы будут зарегистрированы.
			iCanHaz: function(resourcesNames) {
				var resources = _.map(resourcesNames.split(' '), function(resourceName) {
						return ensureResource(resourceName).promise();
					});

				return $.when.apply($, resources).pipe();
			},

			// Освобождает ресурс
			dispose: function(resourcesNames) {
				_.each(resourcesNames.split(' '), function(resourceName) {
					var res = _savedResources[resourceName];

					res && res.reject();
					delete _savedResources[resourceName];
				});

				return this;
			}

		};

	return resources;
});