yifyApp.views.List = Backbone.View.extend({

	views: new Array(),
	categories: new Array(),
	initialize:function (args) {
		var subviews = new Array();
		var operation = "";
		this.getSubviews = function(){
			return subviews;
		}
		this.getOperation = function(){
			return operation;
		}
		this.setOperation = function(op){
			operation = op;
		}

		this.template = _.template(yifyApp.utils.TemplateUtils.get('list'));
		this.setOperation(args.operation);

		var that = this;
		var i = 0;
		$(args.torrents).each(function(index, torrent){
			if(!torrent.MovieTitle)
				return;

			that.getSubviews()[i] = new yifyApp.views.ListItem({operation: that.getOperation(),
			 torrent: torrent});
			that.getSubviews()[i].parent = that;	
			i ++;
		});
	},

	render:function (eventName) {
		$(this.el).html(this.template(this.defaults));

		var that = this;
		setTimeout(function(){
			that.renderViews();
		},500);
		return this;
	},

	renderViews: function(){
		var that = this;
		$(this.getSubviews()).each(function(index, view){
			var viewHtml = view.render();
			$(that.el).find('.gallery-post-grid').append($(viewHtml.el));
		});

		$('.loading').remove();
	}

});