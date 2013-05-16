module.exports = function loginRoutes(mongoExpressAuth, app, newsAPI){
  
  //front page news
  app.get('/news/:page', function(req, res) {
    var page = req.params.page;
    newsAPI.getAllNews(page, makeSendResult(res));
  });

  //get news for a particular listing
  app.get('/news/listing/:username/:page', function(req, res) {
    var username = req.params.username;
    var page = req.params.page;
    newsAPI.getListingNews(username, page, makeSendResult(res));
  });

  app.get('/listing/:username', function(req, res){
    var username = req.params.username;
    newsAPI.getFavoriteTeams(username, makeSendResult(res));
  });

  //create a news listing
  app.post('/listings/new', function(req, res){
    newsAPI.createListing('Favorites', req.body.teams, req.body.username, function(){res.send({})});
  });

  //edit listing
  app.post('/listings/edit', function(req, res){
    newsAPI.editListing(req.body.username, req.body.teams);
    res.send({});
  })
}

function makeSendResult(res){
  return function(err, result){
    if (typeof result === 'number')
      result = String(result);
    if (err)
      res.send({ 'err': 'unknown err' });
    else
      res.send(result);
    }
}
