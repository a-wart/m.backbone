// Здесь мы переопределяем поведение Backbone под свои нужды
define([
	'underscore',
	'backbone',
	'rivets',
	'base/extensions/rivets-adapter'
	], function(_, Backbone, rivets) {

	//
	// Переопределяем поведение Backbone.View
	//
	_.extend(Backbone.View.prototype, {

		// При наличии шаблона отрисовываем содержимое View
		render: function(data) {
			var parsedRenderData;

			if (this.templateName) {
				parsedRenderData = this.getRenderData(data);
				data = parsedRenderData ? parsedRenderData :
									this.model ? this.model.toJSON() :
										(data || {});

				this.template = window.TPL[this.templateName];
				this.el.innerHTML = this.template(data);
			}
			this.bindData();

			// Сигнализируем о готовности View
			this.onRender();

			return this;
		},

		// Позволяет задавать бандинги для Rivets.js
		// По умолчанию байдит model = this.model
		bindModels: function() {
			if (this.model) {
				return {
					model: this.model
				};
			}
		},

		// Собственно прокидывает data-binding для Rivets.js
		bindData: function() {
			var models = this.bindModels();

			if (models) {
				this.rivets = rivets.bind(this.el, models);
			}
		},

		// Переопределим метод для удаления View
		remove: function() {
			this.rivets && this.rivets.unbind();
			this.stopListening();
			// Даём возможность View самому убрать за собой
			this.onRemove();
			this.$el.remove();

			return this;
		},

		// Обработчики по умолчанию
		onRender: function() {},
		onRemove: function() {},
		getRenderData: function() {},

		// Метод добавляющий вью спинер при отправке запроса
		//   model - модель/коллекция к которой нужно подписываться
		//   isCustomEvent - флаг, говорящий о событии на которое нужно подписываться,
		//     true - подписываемся на кастомное событие, которое нужно тригерить вручную
		//     false - подписываемся на стандартное событие, которое тригерится при каждом запросе модели/коллекции
		// По-умолчанию спинер вставляется в элемент вью, для вставки в другой элемент нужно указать
		// селектор в параметр вью loaderContainerSelector, сначала ищем внутри элемента вью, затем если не нашли над элементом,
		// и потом во всем DOM
		addLoader: function(model, isCustomEvent) {
			var loaderContainer;

			if (this.loaderContainerSelector) {
				loaderContainer = this.$el.find(this.loaderContainerSelector);
				loaderContainer.length || (loaderContainer = this.$el.closest(this.loaderContainerSelector));
				loaderContainer.length || (loaderContainer = $(this.loaderContainerSelector));

				this.loaderContainer = loaderContainer;
			} else {
				this.loaderContainer = this.$el;
			}

			model = model || this.model || this.collection;

			if (model) {
				model
					.on((isCustomEvent ? 'before_sync_custom' : 'before_sync'), function(model, options) {
						options = options || {};

						var loader = $(window.TPL['shared:loader']()),
							triggerLoading = options.showLoader !== false;

						if (triggerLoading) {
							loader
								.appendTo(this.loaderContainer)
								.css({
									top: this.loaderContainer[0].scrollTop
								});

							// Небольшое UI улучшение (не даём явно скроллить контейнер
							// прокручиванием колеса мыши)
							// TODO: нужно допилить так, чтобы скроллинг контейнера вообще
							//       не работал (сейчас можно скроллить перетаскиванием
							//       бегунка скроллбара).
							this.loaderContainer.on('mousewheel.loading', function(event) {
								event.preventDefault();
							});
						}
					}, this)
					.on('after_sync', function(model, options) {
						options = options || {};

						var triggerLoading = options.showLoader !== false;

						triggerLoading && this.loaderContainer
							.off('mousewheel.loading')
							.find('.b-loader')
							.remove();
					}, this);
			}
		}
	});


	//
	// Переопределяем поведение Backbone.Collection
	//

	var originalModelGet = Backbone.Model.prototype.get,
		originalModelSet = Backbone.Model.prototype.set;

	//
	// Переопределяем поведение Backbone.Model
	//
	_.extend(Backbone.Model.prototype, {
		// Массив полей, которые не должны попадать
		// в результат работы this.toJSON
		omittedVals: [],

		/*  Добавляем в модель поддержку геттеров и сеттеров
			getters: {
				attr: function(value) {
					return value * 2;
				}
			}
		*/
		getters: {},
		setters: {},

		// Подправляем работу оригинального toJSON так,
		// чтобы он не учитывал поля модели, перечисленные
		// в this.omittedVals
		toJSON: function() {
			var data = _.omit(this.attributes, this.omittedVals);

			for (var attr in data) {
				if (data.hasOwnProperty(attr)) {
					if (this.setters[attr]) {
						data.attr = this.setters[attr](data.attr);
					}
				}
			}

			return data;
		},

		// Добавляем обработку геттеров
		get: function(attr) {
			var value = originalModelGet.apply(this, arguments);

			return this.getters.attr ? this.getters.attr(value) : value;
		},

		// Добавляем обработку сеттеров
		set: function(key, val, options) {
			if (key) {
				if (_.isObject(key)) {
					for (var attr in key) {
						if (this.setters[attr]) {
							key.attr = this.setters[attr](key.attr);
						}
					}
				} else if (this.setters[key]) {
					val = this.setters[key](val);
				}
			}

			return originalModelSet.apply(this, arguments);
		}
	});

	// Переопределение метода синхронизации с беком
	// Заменяем данные для отправки на данные из метода processData текущей модели
	Backbone.sync = function(method, model, options) {
		var methodMap = {
				'create': 'POST',
				'update': 'PUT',
				'delete': 'DELETE',
				'read': 'GET'
			},
			type = methodMap[method],

			// Throw an error when a URL is needed, and none is supplied.
			urlError = function() {
				throw new Error('A "url" property or function must be specified');
			},

			// Default JSON-request options.
			params = { type: type, dataType: 'json' },
			result;

		// Default options, unless specified.
		options || (options = {});


		// Если параметр url модели является функцией передаем в него method
		if (!options.url) {
			params.url = (_.isFunction(model.url) ? model.url(method) : model.url) || urlError();
		}

		// Ensure that we have the appropriate request data.
		if (!options.data && model && (method === 'create' || method === 'update')) {
			params.contentType = 'application/json';
			params.data = JSON.stringify(model.processData ? model.processData(method) : model);
		}

		// Don't process data on a non-GET request.
		if (params.type !== 'GET') {
			params.processData = false;
		}

		var success = options.success;
		options.success = function(resp, status, xhr) {
			model.trigger('after_sync', model, options);
			if (success) {
				success(resp, status, xhr);
			}
			model.trigger('sync', model, resp, options);
		};

		var error = options.error;
		options.error = function(xhr/*, status, thrown*/) {
			model.trigger('after_sync', model, options);
			if (error) {
				error(model, xhr, options);
			}
			model.trigger('error', model, xhr, options);
		};

		if (model.isAbortPreviousRequests || model.isAbortAnyPreviousRequests) {
			model._requests || (model._requests = {});

			// Если у модели/коллекции стоит параметр isAbortPreviousRequests, то
			// если есть активный запрос на этот адрес, удаляем его
			if (model.isAbortPreviousRequests) {
				var request;

				request = model._requests[params.url];
				request && request.abort && request.abort();

			// Если у модели/коллекции стоит параметр isAbortAnyPreviousRequests, то
			// удаляем все активные запросы перед отправкой нового
			} else if (model.isAbortAnyPreviousRequests) {
				_.each(model._requests, function(req) {
					req.abort && req.abort();
				});
			}

			result = model._requests[params.url] = Backbone.ajax(_.extend(params, options));
		} else {
			result = Backbone.ajax(_.extend(params, options));
		}

		// Тригерим событие перед синхронизацией с беком для отображения спиннеров
		model.trigger('before_sync', model, options);

		return result;
	};

});