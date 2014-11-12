// Вью формы поиска билетов
define([
	'core',
	'../models/form',
	'./segment',
	'../collections/segments'
	], function(Core, FormModel, SegmentView, SegmentsCollection) {
	var FormView = Backbone.View.extend({
		templateName: 'form:form',

		events: {
			'submit .b-form': 'submit',
			'click .j-add-segment': 'addSegment'
		},

		initialize: function() {
			this.collection = new SegmentsCollection();
			this.model = new FormModel();

			this.render();
			this.addSegment();
		},

		addSegment: function() {
			var newSegmentView = new SegmentView(),
				submitEl = this.$el.find('.b-button');

			submitEl.before(newSegmentView.$el);
			this.collection.add(newSegmentView.model);
		},

		submit: function(event, wat) {
			this.model.save({segments: this.collection.toJSON()}, {
				success: function(model, response) {
					Core.resources.register('searchParams', response)
					Core.routes.navigate(model.get('url'), {
						trigger: true
					});
				},
				error: function(model, response) {
				}
			});

			return false;
		},

		onRender: function () {

		}
	});

	return FormView;
})