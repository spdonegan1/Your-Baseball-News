var gameIdx = -1;

window.addEventListener('load', function(){

  //set the login/register/logout display
  if (isLoggedIn()){
    $('#loginRegister').hide();
  }
  else {
    $('#logout').hide();
  }

  //sets menu and appropriate classes for animations
  function setMenu(menuActive){
    if (menuActive){
      $('#menu').css('width', '80%');
      $('#content').css('left', '80%');
      $('header').css('left', '80%');
      $('#menu').addClass('menuActive');
      $('header').addClass('menuActiveContent');
      $('#content').addClass('menuActiveContent');
      $('#menu').removeClass('menuNotActive');
      $('header').removeClass('menuNotActiveContent');
      $('#content').removeClass('menuNotActiveContent');
    }
    else{
      $('#menu').css('width', '0px');
      $('#content').css('left', '0px');
      $('header').css('left', '0px');
      $('#menu').addClass('menuNotActive');
      $('header').addClass('menuNotActiveContent');
      $('#content').addClass('menuNotActiveContent');
      $('#menu').removeClass('menuActive');
      $('header').removeClass('menuActiveContent');
      $('#content').removeClass('menuActiveContent');
    }
  }

  //set up live game listings
  function liveGameListing(game, idx){
    var home = game.homeTeam;
    var away = game.awayTeam;

    //convert team abbrev as necesary
    if (home === 'was')
      home = 'wsh';
    else if (home === 'ana')
      home = 'laa';
    else if (home === 'la')
      home = 'lad';

    if (away === 'was')
      away = 'wsh';
    else if (away === 'ana')
      away = 'laa';
    else if (away === 'la')
      away = 'lad';

    var gameDiv = $('<div>');
    gameDiv.addClass('newsItem');

    var homeTeamImg = $('<img>');
    homeTeamImg.addClass('sprite');
    homeTeamImg.addClass('sprite-' + home);
    homeTeamImg.addClass('liveGameTeam');
   
    var awayTeamImg = $('<img>');
    awayTeamImg.addClass('sprite');
    awayTeamImg.addClass('sprite-' + away);
    awayTeamImg.addClass('liveGameTeam');

    var vsSpan = $('<span>');
    vsSpan.html(' VS ');
    vsSpan.css('position', 'absolute');
    vsSpan.css('top', '40%');

    gameDiv.html(homeTeamImg);
    gameDiv.append(vsSpan);
    gameDiv.append(awayTeamImg);
    gameDiv.css('line-height', '20px');
    
    //on button tap load the live game content
    gameDiv.onButtonTap(function(){
      gameIdx = idx;
      $('#liveGameUpdates').html('');
      socket.emit('startGame', {game: idx});
        $('#content').children().each(function(){
          $(this).css('display', 'none');
        });
        $('#content').children().each(function(){
          $(this).css('display', 'none');
        });
        $('#liveGame').show();
    })
    var liveGameListings = $('#liveGameListings');
    liveGameListings.append(gameDiv);
  }
  
  //ajax request to retrieve the live games
  $.ajax({
    type: "GET",
    url: 'liveGames/',
    success: function(data){
      var titleDiv = $('<div>');
      titleDiv.html("Today's live games!");
      titleDiv.css('text-align', 'center');
      titleDiv.css('font-size', '28px');
      titleDiv.css('margin-bottom', '15px');
      $('#liveGameListings').append(titleDiv);
      data.forEach(function(game, idx){liveGameListing(game, idx);})
    }
  })
  
  var menuIcon = $('#menu-icon');
  menuIcon.onButtonTap(function () {
    setMenu(parseInt($('#menu').css('width')) === 0)
  });

  var loginRegister = $('#loginRegister');
  loginRegister.onButtonTap(function () {
    $('#menu').removeClass('menuActive');
    $('#content').children().each(function(){
      $(this).css('display', 'none');
    });
    $('#loginDiv').show();
    if (parseInt($('#menu').css('width')) !== 0)
      setMenu(false);

  });

  var newsLink = $('#newsLink');
  newsLink.onButtonTap(function(){
    $('#menu').removeClass('menuActive');
    $('#content').children().each(function(){
      $(this).css('display', 'none');
    });
    $('#news').show();

    setMenu(false);
  });

  var liveGameLink = $('#liveGameLink');
  liveGameLink.onButtonTap(function(){
    $('#menu').removeClass('menuActive');
    $('#content').children().each(function(){
      $(this).css('display', 'none');
    });
    $('#liveGameListings').show();
    setMenu(false);
  });

  //if logged in add favorites and edit favorites to menu
  if (isLoggedIn()){
    var favoritesLi = $('<li>');
    favoritesLi.html('My Favorite Teams');

    //on button tap show favorites
    favoritesLi.onButtonTap(function(){
      $('#content').children().each(function(){
        $(this).css('display', 'none');
      });
      $('#favoriteNews').show();
      setMenu(false);
    })
    $('#menuItems').append(favoritesLi);

    var username = getUserName();
    var editFavoritesLi = $('<li>');
    editFavoritesLi.html('Edit your favorite teams');

    //display the team logos and set up what to do on submit
    editFavoritesLi.onButtonTap(function(){
      $('#content').children().each(function(){
        $(this).css('display', 'none');
      });
      setMenu(false);

      $('#editFavorites').show();
      $('#submitFavorites').hide();
      var teamsAbbr = ['ari', 'atl', 'bal', 'bos', 'chc', 'cws', 'cin', 'cle', 'col',
                     'det', 'hou', 'kc' , 'laa', 'lad', 'mia', 'mil', 'min', 'nym',
                     'nyy', 'oak', 'phi', 'pit', 'sd' , 'sf' , 'sea', 'stl', 'tb',
                     'tex', 'tor', 'wsh'];
      teamsAbbr.forEach(function(team){
          var teamImg = $('<img>');
          teamImg.addClass('sprite');
          teamImg.addClass('sprite-' + team);
          teamImg.addClass('unselectedLogo');
          teamImg.onButtonTap(function(){
            if ($(this).hasClass('unselectedLogo')){
              $(this).removeClass('unselectedLogo');
            }
            else{
              $(this).addClass('unselectedLogo');
            }
          });
          $('#logos').append(teamImg);
      });
      $('#teamLogos').show();
      var ajaxOptions = {};
      ajaxOptions.type = "GET";
      ajaxOptions.url = '/listing/' + username;
      ajaxOptions.success = function(data){
        data.forEach(function(favTeam){
          for (team in teams){
            if (teams[team] === favTeam){
              $('.sprite-' + team).removeClass('unselectedLogo');
            }
          }
        })
      };
      $.ajax(ajaxOptions);
      $('#editFavorites').onButtonTap(function(){
        var favTeams = [];
          //want to iterate through at find each favorite
          $('#teamLogos .sprite').each(function(){
            if (!$(this).hasClass('unselectedLogo')){
              var teamAbbrev = $(this).attr('class').split(' ')[1].split('-')[1];
              favTeams.push(teams[teamAbbrev]);
            }
          });
          $.ajax({
            type: 'post',
              url: '/listings/edit',
              data: {
                teams: favTeams,
                username: username
              },
              success: function(){
                window.location = '/';
              }
          });
      })
    })
    $('#menuItems').append(editFavoritesLi);
  }

  //otherwise just show login
  else{
    var favoritesLi = $('<li>');
    favoritesLi.html('Log In to View Your Favorite Teams!');
    favoritesLi.onButtonTap(function(){
      $('#menu').removeClass('menuActive');
      $('#content').children().each(function(){
        $(this).css('display', 'none');
      });
      $('#loginDiv').show();
      if (parseInt($('#menu').css('width')) !== 0)
        setMenu(false);
    })
    $('#menuItems').append(favoritesLi);
  }
})



var isLoggedIn = function(){
  var cookies = document.cookie.split('; ');
  for (var i = 0; i < cookies.length; i++){
    var key = cookies[i].substring(0, cookies[i].indexOf('='));
    var value = cookies[i].substring(cookies[i].indexOf('=')+1);
    if (key === 'username'){
      return true;
    }
  }
  return false;
}

var getUserName = function(){
  if (!isLoggedIn())
    return '';
  else{
    var cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++){
      var key = cookies[i].substring(0, cookies[i].indexOf('='));
      var value = cookies[i].substring(cookies[i].indexOf('=')+1);
      if (key === 'username'){
        return value;
      }
    }
  }
}