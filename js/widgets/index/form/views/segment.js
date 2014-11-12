// Segment view
define([
	'core',
	'../models/segment',
	'../collections/segments'
	], function(Core, SegmentModel) {
	var SegmentView = Backbone.View.extend({
		templateName: 'form:segment',

		initialize: function() {
			this.model = new SegmentModel();

			this.model.on('invalid', function() {
				this.showValidationError()
			});

			this.render();
		},

		showValidationError: function () {

		},

		onRender: function () {
		}
	});

	return SegmentView;
})