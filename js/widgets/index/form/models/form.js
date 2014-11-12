// Модель формы поиска
define(['core'
	], function(Core) {
	var FormModel = Backbone.Model.extend({
		url: 'searches/',

		defaults: {
			internal: false,
			locale: "en",
			open_jaw: false,
			passengers: {
				adults: 1,
				children:0,
				infants:0
			},
			segments: [],
			trip_class: "Y"
		}
	});

	return FormModel;
});