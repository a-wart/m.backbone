// Collection of segments
define(['core', '../models/segment'], function(Core, SegmentModel) {
	var SegmentsCollection = Backbone.Collection.extend({
		url: 'searches/',
		model: SegmentModel,

		initialize: function (models, data) {
            this.on('add', function(model, collection){
                model.set('index', --this.length)
            });
		},

		parse: function (response) {
		}
	});

	return SegmentsCollection;
});