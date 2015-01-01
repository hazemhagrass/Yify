 yifyApp.Router = Backbone.Router.extend({
   event: event,
   routes: {
     ""         : "waitLoadingData",
     "latest"   : "latest",
     "upcoming" : "upcoming",
     "details?id=:id" : "details",
   },
   torrents: {
    latest: null,
    upcoming: null
  },

  initialize: function() {
   
  },
  waitLoadingData: function() {
    app.torrents.latest = chrome.extension.getBackgroundPage().cachedTorrents.latest;
    app.torrents.upcoming = chrome.extension.getBackgroundPage().cachedTorrents.upcoming;
    setTimeout(function(){
      if(!app.torrents.latest)
        app.waitLoadingData();
      else
        app.latest();
    },500);
  },

  latest: function() {

    console.log('#latest');
    app.changePage(new yifyApp.views.List({operation: "LATEST",
         torrents: app.torrents.latest}));

  },

  
  details: function(torrentId){
    var torrentModel = new yifyApp.models.Torrent();
    torrentModel.fetchDetails({
      id: torrentId != null ? torrentId : app.torrents.latest[0],
      success: function(details){
        app.changePage(new yifyApp.views.Details({torrent: details.toJSON()}));
      }
    });
  },

  upcoming: function(){

    console.log('#upcoming');
    app.changePage(new yifyApp.views.List({operation: "UPCOMING",
          torrents: app.torrents.upcoming}));

  },

  changePage: function(page) {
   $('div[data-role="page"]').remove();
   $(page.el).attr('data-role', 'page');
   page.render();

   $('.pages-container').append($(page.el));
 }
});

 $(document).ready(function() {
   console.log('document ready');
   yifyApp.utils.TemplateUtils.loadTemplates([
     'list', 'listItem', 'listUpcomingItem', 'details'
     ],function(){
      app = new yifyApp.Router();
      Backbone.history.start();

    }
    );
 });