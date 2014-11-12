// Model of flights segment
define(['core'
	], function(Core) {
	var SegmentModel = Backbone.Model.extend({
		url: '',
		defaults: {
			destination: {
				iata: '',
				name: '',
				type: 'city',
				city: ''
			},
			origin: {
				iata: '',
				name: '',
				type: 'city',
				city: ''
			},
			date: (new Date).toString()
		},

		validate: function(attrs, options) {
			if (!(attrs.origin.iata || attrs.destination.iata)) {
				return 'Validation error';
			}
		},

		initialize: function(options) {
			this
				.on('change:_origin_iata', function(model, value) {
					this.get('origin')['iata'] = value;
				})
				.on('change:_destination_iata', function(model, value) {
					this.get('destination')['iata'] = value;
				});
		}
	});

	return SegmentModel;
});
