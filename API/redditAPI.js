var rereddit = require('rereddit');
exports.getRedditNews = function(newsAPI){
  fullTeamName = {
    'orioles': 'Baltimore Orioles',
    'RedSox': 'Boston Red Sox',
    'Yankees': 'New York Yankees',
    'TampaBayRays': 'Tampa Bay Rays',
    'TorontoBlueJays': 'Toronto Blue Jays',
    'KCRoyals': 'Kansas City Royals',
    'MotorCityKitties': 'Detroit Tigers',
    'MinnesotaTwins': 'Minnesota Twins',
    'WhiteSox': 'Chicago White Sox',
    'WahoosTipi': 'Cleveland Indians',
    'TexasRangers': 'Texas Rangers',
    'oaklandathletics': 'Oakland Athletics',
    'Mariners': 'Seattle Mariners',
    'AngelsBaseball': 'Los Angeles Angels',
    'Astros': 'Houston Astros',
    'azdiamondbacks': 'Arizona Diamondbacks',
    'ColoradoRockies': 'Colorado Rockies',
    'Cubs': 'Chicago Cubs',
    'SFGiants': 'San Francisco Giants',
    'Dodgers': 'Los Angeles Dodgers',
    'Buccos': 'Pittsburgh Pirates',
    'Cardinals': 'St Louis Cardinals',
    'Reds': 'Cincinatti Reds',
    'Brewers': 'Milwaukee Brewers',
    'Padres': 'San Diego Padres',
    'Braves': 'Atlanta Braves',
    'Nationals': 'Washington Nationals',
    'Phillies': 'Philadelphia Phillies',
    'NewYorkMets': 'New York Mets',
    'letsgofish': 'Miami Marlins'
  }
  function getRedditNews(team){
    rereddit.read(team).limit(10)
      .end(function(err, posts) {
        if (posts === undefined) return;
        posts.data.children.forEach(function(post){
          if (!post.data.is_self){
            newsAPI.addNews(post.data.title,
                            post.data.url,
                            post.data.thumbnail,
                            'Reddit',
                            [fullTeamName[team]],
                            post.data.id,
                            post.data.domain,
                            function(){});
          }
        });
      });
  }

  for (team in fullTeamName){
    getRedditNews(team);
  }
}