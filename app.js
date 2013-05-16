var express = require("express");
var app = express();

var io = require('socket.io').listen(8888, { log: false });

var mongo = require('mongodb');

global.mongoConfig = {
  host: 'localhost',
  port: mongo.Connection.DEFAULT_PORT,
  dbName: 'baseballNews'    
}

var mongoExpressAuth = require('mongo-express-auth');

var newsAPI = require('./API/newsAPI.js');
var espnAPI = require('./API/espnAPI.js');
var mlbAPI = require('./API/mlbAPI.js');
var redditAPI = require('./API/redditAPI.js');
//===========================
//  init
//===========================

mongoExpressAuth.init({
  mongo: {
    host: global.mongoConfig.host,
    port: global.mongoConfig.port,
    dbName: global.mongoConfig.dbName,
    collectionName: 'accounts'
  }
}, 
  function(){
    newsAPI.init(function(){
      app.listen(3000);
    });
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'nsrbgkljhrbglsrhgvslerhjgtvsergnb' }));

var rereddit = require('rereddit');

//===========================
//  routes
//===========================

require('./routes/loginRoutes.js')(mongoExpressAuth, app);
require('./routes/newsRoutes.js')(mongoExpressAuth, app, newsAPI);
require('./routes/mlbRoutes.js')(app, mlbAPI);

require('./mlbSockets.js')(mlbAPI, io);


var getNews = function(){
  redditAPI.getRedditNews(newsAPI);
  // espnAPI.getESPNNews(newsAPI);
}

setInterval(getNews, 1000 * 30);

app.use('/', express.static(__dirname + '/static/'));