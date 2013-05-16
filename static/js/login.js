var teams = {ari : 'Arizona Diamondbacks',
   atl : 'Atlanta Braves',
   bal : 'Baltimore Orioles',
   bos : 'Boston Red Sox', 
   chc : 'Chicago Cubs',
   cws : 'Chicago White Sox', 
   cin : 'Cincinatti Reds', 
   cle : 'Cleveland Indians', 
   col : 'Colorado Rockies',
   det : 'Detroit Tigers', 
   hou : 'Houston Astros', 
   kc  : 'Kansas City Royals', 
   laa : 'Los Angeles Angels', 
   lad : 'Los Angeles Dodgers', 
   mia : 'Miami Marlins', 
   mil : 'Milwaukee Brewers', 
   min : 'Minnesota Twins', 
   nym : 'New York Mets',
   nyy : 'New York Yankees', 
   oak : 'Oakland Athletics', 
   phi : 'Philadelphia Phillies', 
   pit : 'Pittsburgh Pirates', 
   sd  : 'San Diego Padres', 
   sf  : 'San Francisco Giants', 
   sea : 'Seattle Mariners', 
   stl : 'St Louis Cardinals', 
   tb : 'Tampa Bay Rays',
   tex : 'Texas Rangers',
   tor : 'Toronto Blue Jays', 
   wsh : 'Washington Nationals'
  }

window.addEventListener('load', function(){
  (function(){

    var g = {
      onLoginSuccess: function(){
        window.location = '/';
      },
      onRegisterSuccess: function(){
        var successDiv = $('<div>');
        successDiv.html('Registering Now!');
        successDiv.css('text-align', 'center');
        $('#loginDiv').prepend(successDiv);
        var username = usernameInput.val();
        var password = passwordInput.val();
        $('#menu-icon').hide();
        $('#loginRegister').hide();
        $('#loginDiv').hide();
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
        var submitFavorites = $('#submitFavorites')
        submitFavorites.onButtonTap(function(){
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
              url: '/listings/new',
              data: {
                teams: favTeams,
                username: username
              },
              success: function(){
                login(username, password);
              }
          });
          
        });
      },
      onRegisterFail: function(msg){
        $('#errorSpan').remove();
        var errorSpan = $('<span>');
        errorSpan.html(msg);
        errorSpan.css('color', 'red');
        errorSpan.attr('id', 'errorSpan');
        $('#loginDiv').prepend(errorSpan);
      },
      onLoginFail: function(msg){
        $('#errorSpan').remove();
        var errorSpan = $('<span>');
        errorSpan.html(msg);
        errorSpan.css('color', 'red');
        errorSpan.attr('id', 'errorSpan');
        $('#loginDiv').prepend(errorSpan);
      }
    }


    window.LoginManager = {
      setLoginSuccess: function(callback){
        g.onLoginSuccess = callback;
      },
      setRegisterSuccess: function(callback){
        g.onRegisterSuccess = callback;
      },
      setRegisterFail: function(callback){
        g.onRegisterFail = callback;
      },
      setLoginFail: function(callback){
        g.onLoginFail = callback;
      }
    }


    var loginButton = $('#loginButton');
    var registerButton = $('#registerButton');

    var usernameInput = $('#usernameInput');
    var passwordInput = $('#passwordInput');

    loginButton.onButtonTap(function(){
      var username = usernameInput.val();
      var password = passwordInput.val();
      login(username, password);
    });

    registerButton.onButtonTap(function(){
      var username = usernameInput.val();
      var password = passwordInput.val();
      var success = true;
      if (username === ''){
        var errorSpan = $('<span>');
        errorSpan.html('Non empty username');
        $(errorSpan).css('color', 'red');
        $('#usernameField').append(errorSpan);
      }
      if (password === ''){
        var errorSpan = $('<span>');
        errorSpan.html('Non empty password');
        $(errorSpan).css('color', 'red');
        $('#passwordField').append(errorSpan);
        success = false;
      }

      if (success)
        register(username, password);
    });

    function login(username, password, done){
      var request = $.ajax({
        type: 'post',
        url: '/login',
          data: {
            username: username, 
            password: password 
          }
        });
        setupCallback(request, handleLoginResult);
      }

    function register(username, password, done){
      var request = $.ajax({
        type: 'post',
        url: '/register',
        data: {
          username: username, 
          password: password 
        }
      });
    
      setupCallback(request, handleRegisterResult);
    }

    function handleRegisterResult(err, result){
      if (err)
        throw err;
      if (result === 'ok'){
        g.onRegisterSuccess();
      }
      else
        g.onRegisterFail(result);
      }

    function handleLoginResult(err, result){
      if (err)
        throw err;
      if (result === 'ok')
        g.onLoginSuccess();
      else
        g.onLoginFail(result);
      }

    function setupCallback(request, done){
      request.done(function(data) {
        if (data.err !== undefined)
          done(data.err, null);
        else
          done(null, data);
      });
      
      request.fail(function(jqXHR, textStatus, err){
        done(err, null);
      });
    }

    })();
});