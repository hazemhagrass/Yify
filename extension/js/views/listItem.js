yifyApp.views.ListItem = Backbone.View.extend({

	initialize:function (args) {
		var torrents = args.torrents;
		this.getTorrents = function(){
			return torrents;
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
		$(that.el).html(that.template({torrents: this.getTorrents()}));
		setTimeout(function(){
			$(that.el).find('.accordion-group').unwrap();
		}, 250);

		return that;
	}
});