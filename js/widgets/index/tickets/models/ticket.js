// Search results model
define(['core'
	], function(Core) {
	var TicketModel = Backbone.Model.extend({
		url: '',

		defaults: {
            'test': 'test'
		}
	});

	return TicketModel;
});