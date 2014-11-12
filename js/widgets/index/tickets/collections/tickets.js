// Collection of tickets
define(['core'], function(Core) {
	var TicketsCollection = Backbone.Collection.extend({
		url: '',

		initialize: function (options) {
			this.url = ['/searches?uuid=', options.search_id].join('');
		},

		parse: function (response) {
			return response;
		}
	});

	return TicketsCollection;
});