define([
	'core',
	'../models/ticket',
	'../collections/tickets'
	], function(Core, TicketModel, TicketsCollection) {
	var TicketsAppView = Backbone.View.extend({
		templateName: 'tickets:tickets',

		events: {
		},

		model: TicketModel,

		initialize: function(options) {
			this.collection = new TicketsCollection(options.response);

			// TODO: Think about this. Use promises.All,
			// Extend Collection.fetch with multiple requests logic, or use Marionette.
			this.collection.fetch({
				success: function(data, resp) {
					this.collection.fetch({
						success: function (model, response) {
							console.log(this.collection);
							this.render()
						}.bind(this)
					})
				}.bind(this),
				error: function(data, resp) {

				}
			});
		},

		getRenderData: function() {
			return this.collection.toJSON();
		}
	});

	return TicketsAppView;
})