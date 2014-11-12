// Searches results widget
define(['core', './views/app_tickets'], function(Core, TicketsView) {

	var SearchesResultsWidget = Backbone.View.extend({
		events: {

		},

		initialize: function() {
			Core.resources.iCanHaz('searchParams').then(function(data) {
				this.currentView = new TicketsView(data);
				$('.b-tickets-container').html(this.currentView.el);
			});
		},

		onRemove: function() {
			this.off();
			this.currentView.remove();
		}
	});

	return SearchesResultsWidget;

});