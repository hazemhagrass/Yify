yifyApp.views.Details = Backbone.View.extend({

	defaults: {
		torrent: null
	},

	initialize:function (args) {
		this.defaults.torrent = args.torrent;
		this.template = _.template(yifyApp.utils.TemplateUtils.get('details'));
	},

	render:function (eventName) {
		$('#spinner').hide();
		$(this.el).html(this.template(this.defaults.torrent));
		
		return this;
	}
});