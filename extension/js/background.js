function checkTorrents() {
    cachedTorrents = {};
    checkLatestTorrents();
    checkUpcomingTorrents();
}

function checkLatestTorrents() {
    var torrent = new yifyApp.models.Torrent();
    torrent.fetchLatest({
        limit: 50,
        success: function (latest) {
            var latestTorrents = latest.toJSON().MovieList;
            cachedTorrents.latest = mergeTorrents(latestTorrents);

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
                    url: latestTorrent.MovieUrl
                });
            });
        }
    });
}

function checkUpcomingTorrents() {
    cachedTorrents.upcoming = new Array();
    var torrent = new yifyApp.models.Torrent();
    torrent.fetchUpcoming({
        limit: 50,
        success: function (upcoming) {
            upcoming = upcoming.toJSON();
            var torrents = $.map(upcoming, function (value, index) {
                return [value];
            });
            cachedTorrents.upcoming = mergeTorrents(torrents);

        }
    });
}

function mergeTorrents(torrents) {
    var mergedCachedTorrentsHash = new Array();
    var mergedTorrents = new Array();

    $(torrents).each(function (index, torrent) {
        if (!torrent.MovieTitleClean)
            mergedCachedTorrentsHash[torrent.MovieTitle] = new Array(torrent);

        else if (!mergedCachedTorrentsHash[torrent.MovieTitleClean])
            mergedCachedTorrentsHash[torrent.MovieTitleClean] = new Array(torrent);

        else
            mergedCachedTorrentsHash[torrent.MovieTitleClean].push(torrent);

    });
    Object.keys(mergedCachedTorrentsHash).forEach(function (key) {
        mergedTorrents.push(mergedCachedTorrentsHash[key]);
    });
    return mergedTorrents;
}

var tickTime = 5 * 60000;
setInterval(function () {
    checkTorrents();
}, tickTime);
checkTorrents();