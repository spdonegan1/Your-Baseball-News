module.exports = function (mlbAPI, io){
  var todaysGames = [];

  //initialize todaysGames structure
  mlbAPI.getTodaysGames(function(results){
    results.forEach(function(game){
      game.msgs = [];
      game.listeningSockets = [];
      todaysGames.push(game);
    });
  })

  io.sockets.on("connection", function(socket) {

    //when a socket connects to a game send it the history 
    socket.on('startGame', function(data){
      var game = data.game;
      var gameMsgs = todaysGames[game].msgs;
      todaysGames[game].listeningSockets.push(socket);
      gameMsgs.forEach(function(msg){
        socket.emit('gameUpdate', {msg: msg});
      });
    })
    
    //chat messages
    socket.on('msg', function(data) {
      todaysGames[data.gameIdx].listeningSockets.forEach(function(socket){
        socket.emit('newmsg', data);
      })
      
    });

    //remove the socket from the listeningSockets on disconnect
    socket.on('disconnect', function(){
      todaysGames.forEach(function(game){
        var idx = game.listeningSockets.indexOf(socket);
        if (idx !== -1){
          game.listeningSockets.splice(idx, 1);
        }
      })
    })
  });

  var foo = function(){
    console.log(todaysGames);
    //update all of the games
    todaysGames.forEach(function(game){
      mlbAPI.liveGameThreadUpdate(game.url, game.maxAtBat, function(maxAtBat,rv){
        game.maxAtBat = maxAtBat;
        //emit to all listening sockets
        game.listeningSockets.forEach(function(socket){
          if (rv.length !== 0){
            rv.forEach(function(msg){
              socket.emit('gameUpdate', {msg: msg});
            });
          }
            // socket.emit('gameUpdate', {updates: rv});
        });
        //save for later
        game.msgs.push.apply(game.msgs, rv);

      });
    })
  }

  setInterval(foo, 1000 * 10);
}