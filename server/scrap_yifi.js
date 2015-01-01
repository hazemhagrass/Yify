var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://yify-torrents.com/browse-movie/0/All/All/0/latest/0';
var data = {};
var sleepInterval = 1000 * 60 * 5; //seconds

setInterval(function(){
    //request latest torrent url
request(url, function(err, resp, body) {
    if (err)
        throw err;
    $ = cheerio.load(body);
    
    var latestTorrent = $('.browse .browse-wrapper')[0];
    data.torrent_url = $(latestTorrent).find(".browse-img a").attr('href');
    data.poster_url = $('.browse .browse-wrapper .browse-img img').attr('src');

    //request latest torrent info
    request(data.torrent_url, function(err, resp, body) {
        if (err)
            throw err;

        $ = cheerio.load(body);
        data.title = $('.movie-content .movie-info h1').html();
        data.genre = $($('.movie-content .movie-info p')[0]).text();
        data.size = $($('.movie-content .movie-info p')[1]).text();
        data.quality = $($('.movie-content .movie-info p')[2]).text();
        data.resolution = $($('.movie-content .movie-info p')[3]).text();
        data.frame_rate = $($('.movie-content .movie-info p')[4]).text();
        data.language = $($('.movie-content .movie-info p')[5]).text();
        data.IMDB_rating = $($('.movie-content .movie-info p')[8]).text();  
        data.peers_seeds = $($('.movie-content .movie-info p')[10]).text();
        data.download_link = $($('.movie-content .movie-info .std-btn.torrentDwl')).attr('href')
        
        data.desc = $($('#movie-wrapper .movie-descr .description p')[0]).text();
        data.uploaded = $($('#movie-wrapper .movie-descr .description p')[4]).text();
        data.downloaded = $($('#movie-wrapper .movie-descr .description p')[5]).text();

        //retrieve screenshots
        data.screenshots = new Array();
        var screenshotsImages = $('#movie-wrapper .screenshots img');
        for(var i = 0; i < screenshotsImages.length; i++){
            data.screenshots[i] = $(screenshotsImages[i]).attr('src');
        }

        //remove extra strings
        data.genre = data.genre.replace("Genre: ", "");
        data.size = data.size.replace("Size: ", "");
        data.quality = data.quality.replace("Quality: ", "");
        data.resolution = data.resolution.replace("Resolution: ", "");
        data.frame_rate = data.frame_rate.replace("Frame Rate: ", "");
        data.language = data.language.replace("Language: ", "");
        data.IMDB_rating = data.IMDB_rating.replace("IMDB Rating: ", "");
        data.peers_seeds = data.peers_seeds.replace("Peers/Seeds: ", "");
        data.uploaded = data.uploaded.replace("Uploaded: ", "");
        data.downloaded = data.downloaded.replace("Downloaded: ", "").replace(" times", "");

        var jsonData = JSON.stringify(data);

        fs.writeFile("/var/www/yifi/server/data/latest_torrent_info.json", jsonData, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        }); 


        console.log(jsonData);

    });

});
}, sleepInterval);

