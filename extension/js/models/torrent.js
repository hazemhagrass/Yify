yifyApp.models.Torrent = Backbone.Model.extend({
	urlRoot: 'http://yts.im/api/',

	fetchLatest: function(options){
		options = options || {limit: 10};
		options.url = this.urlRoot + "list.json?limit="+ options.limit+ "&sort=date&order=desc";

		return Backbone.Model.prototype.fetch.call(this, options);
	},

	fetchUpcoming: function(options){
		options = options || {};
		options.url = this.urlRoot + "upcoming.json";

		return Backbone.Model.prototype.fetch.call(this, options);
	},

	fetchDetails: function(options){
		options = options || {};
		options.url = this.urlRoot + "movie.json?id=" + options.id;
		
		return Backbone.Model.prototype.fetch.call(this, options);
	}

});
