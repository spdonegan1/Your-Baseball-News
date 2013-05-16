var g = {
  mongoClient: null,
  newsCollection: null,
  listingsCollection: null
}

var numNewsPerPage = 20;

exports.init = function(done){
  initMongo(done);
}


exports.getAllNews = function(page, done){
  g.newsCollection.find().skip(page*numNewsPerPage)
                         .limit(numNewsPerPage)
                         .sort( { $natural: -1 } )
                         .toArray(done);
}

exports.addNews = function(title, link, thumbnail, source, 
                           teams, sourceId, sourceURL, done){
  g.newsCollection.findOne
   ({sourceId: sourceId},
    function(error, result){
      if (error)
        throw error;

      if (result !== null){
      }
      else{
        g.newsCollection.insert(
            {
              title: title,
              link: link,
              thumbnail: thumbnail,
              source: source,
              sourceURL: sourceURL,
              teams: teams,
              sourceId: sourceId
            },
            function(err, result){
              if (err){
                done(err, null)
              }
              else
                done(null, result[0]._id)
            })
        }
      })
  
}

//get news for a given listing id
exports.getListingNews = function(username , page, done){
  g.listingsCollection.findOne(
    {username: username},
    function(error, result){
      g.newsCollection.find({teams: {$in: result.teams}})
                      .skip(page*numNewsPerPage)
                      .limit(numNewsPerPage)
                      .toArray(done);
    })
}

//get favorite teams
exports.getFavoriteTeams = function(username, done){
  g.listingsCollection.findOne({username: username}, 
                               function(error, result){
                                done(error, result.teams)});
}
//teams is array of strings (team names)
exports.createListing = function(name, teams, username, done){
  g.listingsCollection.insert(
    {
      name: name,
      teams: teams,
      username: username
    },
    function(err, result){
      if (err)
        done(err, null)
      else
        done(null, result[0]._id);
    });
}

exports.editListing = function(username, teams){
  g.listingsCollection.update({username: username},
                              {$set :{teams: teams}},
                              {},
                              function(){});
}

//===========================
//  MONGO INIT
//===========================

var mongo = require('mongodb');

var mongoConfig = {
  host: global.mongoConfig.host,
  port: global.mongoConfig.port,
  dbName: global.mongoConfig.dbName,
  collectionName: 'news'
};

function initMongo(done){

  var host = mongoConfig.host;
  var port = mongoConfig.port;

  var optionsWithEnableWriteAccess = { w: 1 };

  g.mongoClient = new mongo.Db(
    mongoConfig.dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
  );

  openCollection(done);
}

function openCollection(done){
  g.mongoClient.open(onDbReady);

  function onDbReady(error){
    if (error)
      done(error)

    g.mongoClient.collection('news', onCollectionReady);
  }

  function onCollectionReady(error, collection){
    if (error)
      done(error)

    if (collection.collectionName === 'news'){
      g.newsCollection = collection;
      g.mongoClient.collection('listings', onCollectionReady);
    }
    else{
      g.listingsCollection = collection;
      done();
    }    
  }
}
