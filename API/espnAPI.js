var $ = require('jquery');

exports.getESPNNews = function(newsAPI){
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "http://api.espn.com/v1/now/?leagues=mlb&apikey=86keqhg4uhs4jswzmytqd3k3&callback=?",
    jsonpCallback: 'callback',
    success: function(data) {
        var feed = data.feed;
        for (var i = 0; i < feed.length; i++){
            var newsItem = feed[i];
            var headline = newsItem.headline;
            var link = newsItem.links.mobile.href;
            var espnID = newsItem.id;
            var source = 'ESPN';
            var teams = [];
            if (newsItem.categories !== undefined){
              for (var j = 0; j < newsItem.categories.length; j++){
                var thisCategory = newsItem.categories[j];
                if (thisCategory.type === 'team'){
                  teams.push(thisCategory.team.description);
                }
              }
            }
            newsAPI.addNews(headline, link, null, source, teams, 
                            espnID, undefined, function(){});
        }
    },
  });
}
