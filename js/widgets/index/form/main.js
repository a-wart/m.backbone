// Searches form widget
define(['core', './views/app_form'], function(Core, AppFormView) {
	var FormWidget = Backbone.View.extend({
		currentView: null,

		initialize: function(options) {
			this.container = $(options.container);
			this.on('all', this.showView, this);
			this.showView();
		},

		showView: function(page) {
			this.currentView && this.currentView.remove();
			this.currentView = new AppFormView();
			this.container.html(this.currentView.el);
		},

		onRemove: function() {
			this.off();
			this.currentView.remove();
		}
	});

	return FormWidget;
});