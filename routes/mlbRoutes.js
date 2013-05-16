module.exports = function loginRoutes(app, mlbAPI){
  app.get('/liveGames', function(req, res) {
    mlbAPI.getTodaysGames(function(result){res.send(result);});
  });
};