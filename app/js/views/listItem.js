yifyApp.views.ListItem = Backbone.View.extend({

	initialize:function (args) {
		var torrent = args.torrent;
		this.getTorrent = function(){
			return torrent;
		}
		var operation = "";
		this.getOperation = function(){
			return operation;
		}
		this.setOperation = function(op){
			operation = op;
		}
		this.setOperation(args.operation);
		if(this.getOperation() == 'LATEST')
			this.template = _.template(yifyApp.utils.TemplateUtils.get('listItem'));
		else
			this.template = _.template(yifyApp.utils.TemplateUtils.get('listUpcomingItem'));
	},

	render:function (eventName) {
		var that = this;
		$(that.el).html(that.template({torrent: this.getTorrent()}));
		setTimeout(function(){
			$(that.el).find('.gallery-item').unwrap();
		}, 250);

		return that;
	}
});