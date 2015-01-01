
/**
 * Module dependencies.
 */

var sys = require("sys");
var fs = require('fs') 
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8091);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res){
	//read latest torrent json data which is already scrapped
	fs.readFile('/var/www/yifi/server/data/latest_torrent_info.json', 'utf8', function (err,data) {
		
		sys.puts("Latest torrent data was retrieved"); 

		if (err) {
			return console.log(err);
		}

		res.setHeader('Content-Type', 'text/plain');
  		res.setHeader('Content-Length', Buffer.byteLength(data));
		res.end(data);
		sys.puts("Request Handled"); 
		sys.puts("---------------------"); 
	});

});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
