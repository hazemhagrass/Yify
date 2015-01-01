function checkTorrents() {
    cachedTorrents = {
        latest: null,
        genres: new Array()
    };
    checkLatestTorrents();
}

function fetchTorrentDetails(index, id, callback) {
    var torrent = new yifyApp.models.Torrent();
    torrent.fetchDetails({
        id: id,
        success: function (details) {
            callback(index, details.toJSON());
        }
    });
}

function checkLatestTorrents() {
    var torrent = new yifyApp.models.Torrent();
    torrent.fetchLatest({
        limit: 20,
        success: function (latest) {
            var latestTorrents = latest.toJSON().MovieList;
            cachedTorrents.latest = latestTorrents;

            $(cachedTorrents.latest).each(function (index, torrent) {
                fetchTorrentDetails(index, torrent.MovieID, function (index, torrent) {
                    cachedTorrents.latest[index] = torrent;
                    cachedTorrents.genres[torrent.Genre1] = torrent.Genre1;
                    cachedTorrents.genres[torrent.Genre2] = torrent.Genre2;
                });
            });

            var latestTorrent = latestTorrents[0];
            if (localStorage.getItem(latestTorrent.TorrentUrl) == "seen") {
                //notification seen before
                return;
            }
            //mark torrent url as seen before via localStorage
            localStorage.setItem(latestTorrent.TorrentUrl, "seen");

            var id = "yify_" + new Date().getTime();
            var opt = {
                type: "basic",
                title: latestTorrent.MovieTitleClean,
                message: 'Year: ' + latestTorrent.MovieYear +
                    ', Genre: ' + latestTorrent.Genre +
                    ', Size:' + latestTorrent.Size +
                    ', Quality: ' + latestTorrent.Quality +
                // ', Resolution: ' + latestTorrent.resolution + 
                //', Language: ' + latestTorrent.Language + 
                ', IMDB Rating: ' + latestTorrent.MovieRating +
                // ', Frame Rate: ' + latestTorrent.frame_rate + 
                ', Peers/Seeds: ' + latestTorrent.TorrentPeers + "/" + latestTorrent.TorrentSeeds,
                iconUrl: latestTorrent.CoverImage
            }
            var notification = chrome.notifications.create(id, opt, function () {
                setTimeout(function () {
                    chrome.notifications.clear(id, function () {
                        console.log('clear')
                    })
                }, 15000);
            });
            chrome.notifications.onClicked.addListener(function () {
                chrome.windows.create({
                    url: latestTorrent.TorrentUrl
                });
            });
        }
    });
}


var tickTime = 5 * 60000;
setInterval(function () {
    checkTorrents();
}, tickTime);
checkTorrents();