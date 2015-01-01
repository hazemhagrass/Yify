var sys = require("sys");
var socket = require("http");
var fs = require('fs')  
var port = 8090;

var crossdomain = "";
//fs.readFile('/var/www/yifi/server/crossdomain.xml', 'utf8', function (err,data) {
//	if (err) {
//		return console.log(err);
//	}
//	crossdomain = data;
//	sys.puts("Crossdomain policy file is loaded"); 
//});

//read latest torrent json data which is already scrapped
socket.createServer(function(request,response){  
	sys.puts("Incoming Request"); 

	//read latest torrent json data which is already scrapped
	fs.readFile('/var/www/yifi/server/data/latest_torrent_info.json', 'utf8', function (err,data) {
		
		sys.puts("Latest torrent data was retrieved"); 

		if (err) {
			return console.log(err);
		}

		if(socket && socket.readyState == 'open')
	      socket.write(crossdomain);
	    sys.puts("Crossdomain policy was added to the request"); 

		response.writeHeader(200, {"Content-Type": "text/plain"});  
		response.write(data);  
		response.end(); 

		sys.puts("Request Handled"); 
		sys.puts("---------------------"); 
	});


}).listen(port);  
sys.puts("Server Running on " + port); 



