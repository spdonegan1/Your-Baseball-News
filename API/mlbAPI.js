var xml2js = require('xml2js');
var $ = require('jquery');
// var maxAtBat = 0;

exports.liveGameThreadUpdate = function(url, maxAtBat, done){
  var parser = new xml2js.Parser();
  parser.on('end', function(result) {
    var rv = [];
    for (inning in result.game.inning){
      var topInning = result.game.inning[inning].top[0];
      for (batter in topInning.atbat){
        if (parseInt(topInning.atbat[batter].$.num) > maxAtBat){
          rv.push(topInning.atbat[batter].$.des);
          maxAtBat = parseInt(topInning.atbat[batter].$.num);
        }
      }
      if ('bottom' in result.game.inning[inning]){
        var botInning = result.game.inning[inning].bottom[0];
        for (batter in botInning.atbat){
          if (parseInt(botInning.atbat[batter].$.num) > maxAtBat){
            rv.push(botInning.atbat[batter].$.des);
            maxAtBat = parseInt(botInning.atbat[batter].$.num);
          };
        }
      }    
    }
    console.log(rv);
    done(maxAtBat, rv);
  });

  var ajaxOptions = {};
  ajaxOptions.type = "GET";
  ajaxOptions.dataType = "text/xml";
  ajaxOptions.url = url;
  ajaxOptions.error = function (xhr, ajaxOptions, thrownError) { 
    if (xhr.responseText === 'GameDay - 404 Not Found')
      return;
    if (xhr.responseText[0] === 'E')
      return;
    parser.parseString(xhr.responseText);
  }
  $.ajax(ajaxOptions);
}

exports.getTodaysGames = function(done){
  function getGameScheduleURL (){
    var currDate = new Date();
    
    var currMonth = currDate.getMonth() + 1;
    currMonth = currMonth + "";
    if (currMonth.length === 1) currMonth = "0" + currMonth;
    
    var currDay = currDate.getDate();
    currDay = currDay + "";
    if (currDay.length === 1) currDay = "0" + currDay;

    var url = "http://mlb.mlb.com/lookup/json/named.bcapi_game_sched.bam?start_date='2013/"
    url += currMonth;
    url += "/";
    url += currDay;
    url += "'&end_date='2013/"
    url += currMonth;
    url += "/"
    url += currDay;
    url += "'&season=2013&sport_code='mlb'";
    return url;
  }

  function getUrl(homeTeam, awayTeam){
    var currDate = new Date();
    
    var currMonth = currDate.getMonth() + 1;
    currMonth = currMonth + "";
    if (currMonth.length === 1) currMonth = "0" + currMonth;
    
    var currDay = currDate.getDate();
    currDay = currDay + "";
    if (currDay.length === 1) currDay = "0" + currDay;
    
    var url = "http://gd2.mlb.com/components/game/mlb/year_2013/month_"
    url += currMonth;
    url += "/day_";
    url += currDay;
    url += "/gid_2013_";
    url += currMonth;
    url += "_";
    url += currDay;
    url += "_";
    url += awayTeam;
    url += "mlb_";
    url += homeTeam;
    url += "mlb_1/inning/inning_all.xml";
    return url;
  }

  var ajaxOptions = {};
  ajaxOptions.type = "GET";
  ajaxOptions.dataType = "json";
  ajaxOptions.url = getGameScheduleURL();
  ajaxOptions.success = function(data){
    var results = [];
    foo = data.bcapi_game_sched.queryResults;
    for (var i = 0; i < foo.row.length; i++){
      var homeTeam = foo.row[i].home_team_file_code;
      var awayTeam = foo.row[i].away_team_file_code;
      var homeTeamURL = homeTeam;
      var awayTeamURL = awayTeam;
      
      //fix yankees
      if (homeTeam === 'nyy')
        homeTeamURL = 'nya';
      if (awayTeam === 'nyy')
        awayTeamURL = 'nya';
      //fix cardinals
      if (homeTeam === 'stl')
        homeTeamURL = 'sln'
      if (awayTeam === 'stl')
        awayTeamURL = 'sln'
      //fix padres
      if (homeTeam === 'sd')
        homeTeamURL = 'sdn';
      if (awayTeam === 'sd')
        awayTeamURL = 'sdn';
      //fix cubs
      if (homeTeam === 'chc')
        homeTeamURL = 'chn';
      if (awayTeam === 'chc')
        awayTeamURL = 'chn'
      //fix dodgers
      if (homeTeam === 'la')
        homeTeamURL = 'lan';
      if (awayTeam === 'la')
        awayTeamURL = 'lan'
      //fix royals
      if (homeTeam === 'kc')
        homeTeamURL = 'kca';
      if (awayTeam === 'kc')
        awayTeamURL = 'kca'
      //fix mets
      if (homeTeam === 'nym')
        homeTeamURL = 'nyn';
      if (awayTeam === 'nym')
        awayTeamURL = 'nyn'
      //fix giants
      if (homeTeam === 'sf')
        homeTeamURL = 'sfn'
      if (awayTeam === 'sf')
        awayTeamURL = 'sfn';
      //fix giants
      if (homeTeam === 'tb')
        homeTeamURL = 'tba'
      if (awayTeam === 'tb')
        awayTeamURL = 'tba';
      
      var url = getUrl(homeTeamURL, awayTeamURL);
      results.push({homeTeam: homeTeam, awayTeam: awayTeam, url: url, maxAtBat: 0});
    }
    done(results);
  }
  $.ajax(ajaxOptions);
}
