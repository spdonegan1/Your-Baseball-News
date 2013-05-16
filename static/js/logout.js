window.addEventListener('load', function(){
  (function(){

    var g = {
      handleLogoutResult: function(err, result){
        window.location = '/';
      }
    }

    window.LogoutManager = {
      setHandleLogoutResult: function(callback){
        g.handleLogoutResult = callback;
      }
    }

    var logoutButton = $('#logout');

    logoutButton.onButtonTap(function(){
      var request = $.ajax({type: 'post', url: '/logout'});
      setupCallback(request, g.handleLogoutResult);
    });

    function setupCallback(request, done){
      request.done(function(data) {
        if (data.err !== undefined)
          done(data.err, null);
        else
          done(null, data);
      });
      request.fail(function(jqXHR, textstatus, err){
        done(err, null);
      });
    }
  })();
});