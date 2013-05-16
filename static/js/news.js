var currPage = 0;
var endOfResults = false;
var currFavPage = 0;
var endOfResultsFav = false;

//setup local storage if not already done
if (typeof(localStorage) !== "undefined") {
  if (localStorage['yourbaseballnews'] === undefined)
    localStorage['yourbaseballnews'] = JSON.stringify({});
}

//marks the specified news id as read
function isRead(id){
  if (typeof(localStorage) !== "undefined") {
    var data = JSON.parse(localStorage['yourbaseballnews']);
    data[id] !== undefined;
  }
  return false;
}

//checks if news with the specified id has been read
function read(id){
  if (typeof(localStorage) !== "undefined") {
    var data = JSON.parse(localStorage['yourbaseballnews']);
    data[id] = true;
    localStorage['yourbaseballnews'] = JSON.stringify(data);
  }
}

function updateNewsListing(data, containerStr){

  //shuffle the news so we don't have a run of espn vs. non espn
  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };
  data = shuffle(data);
  
  var container = $(containerStr);
  if (data.length === 0){
    endOfResultsDiv = $('<div>');
    endOfResultsDiv.html('No more news to display');
    endOfResultsDiv.css('text-align', 'center');
    endOfResultsDiv.css('height', '50px');
    container.append(endOfResultsDiv);
    endOfResults = true;
    return;
  }
  data.forEach(function(newsItem){

    var newsItemDiv = $('<div>');
    newsItemDiv.addClass('newsItem');

    //news title
    var titleSpan = $('<span>');
    titleSpan.addClass('newsHeadline');
    titleSpan.html(newsItem.title);
  
    //thumbnail of news
    var thumbnail = $('<img>');
    thumbnail.addClass('thumbnail');
    if (newsItem.teams.length > 0){
        for (key in teams){
          if (teams[key] === newsItem.teams[0])
            var team = key;
        }
        if (team === 'was')
          team = 'wsh';
        else if (team === 'ana')
          team = 'laa';
        else if (team === 'la')
          team = 'lad';
        thumbnail.addClass('sprite');
        thumbnail.addClass('sprite-' + team);
        thumbnail.addClass('liveGameTeam');
      }
    //news source elem
    var newsSrc = $('<span>');
    newsSrc.addClass('newsSrc');
    if (newsItem.source === 'ESPN'){
      newsSrc.html('espn.go.com');
    }
    else{
      newsSrc.html(newsItem.sourceURL);
    }

    //put all elems into the new div
    newsItemDiv.append(thumbnail);  
    newsItemDiv.append(titleSpan);
    newsItemDiv.append(newsSrc);

    //set data attributes based off of news item
    newsItemDiv.attr('data-href', newsItem.link);
    newsItemDiv.attr('data-id', newsItem.sourceId);

    //check if article has already been read
    var foo = JSON.parse(localStorage['yourbaseballnews']);
    if (foo[newsItem.sourceId]){
      newsItemDiv.addClass('hasRead');
    }
    container.append(newsItemDiv);
    
    //on tap load associated link in a new tab/window
    newsItemDiv.onButtonTap(function(){
      var id = $(this).data('id');
      read(id);
      var link = $(this).data('href');
      $(this).addClass('hasRead');
      window.open(link, '_blank');

    });
  });

  var loadDiv = $('<button>');
  // loadDiv.addClass('newsItem');
  loadDiv.html('Load more news!');
  loadDiv.attr('id', 'loadNews');
  loadDiv.css('text-align', 'center');
  loadDiv.css('width', '90%');
  loadDiv.css('margin-right', '5%');
  loadDiv.css('margin-left', '5%');
  loadDiv.onButtonTap(function(){
    $(this).html('Loading...');
    if(containerStr === '#news'){
      addNews();
    }
    else
      addFavNews();
    $(this).remove();
  });
  container.append(loadDiv);
}

window.addEventListener('load', function(){
  //get front page news
  $.ajax({
    type: "GET",
    url: "news/0",
    success: function(data){
      $('#news').html(' ');
      updateNewsListing(data, '#news');
    }
  });

  //if logged in get first page of favorite news
  if (isLoggedIn()){
    var ajaxOptions = {};
    ajaxOptions.type = "GET";
    ajaxOptions.url = "/news/listing/" + getUserName() + "/0/";
    ajaxOptions.success = function(data){
      updateNewsListing(data, '#favoriteNews');
    };
    $.ajax(ajaxOptions);
  }
})

//adds on next page of front page news
var addNews = function(){
  currPage += 1;
  var ajaxOptions = {};
  ajaxOptions.type = "GET";
  ajaxOptions.url = "news/" + currPage;
  ajaxOptions.success = function(data){
    updateNewsListing(data, '#news');
  }
  $.ajax(ajaxOptions);
}

//adds on next page of favorite team news
var addFavNews = function(){
  currFavPage += 1;
  var ajaxOptions = {};
  ajaxOptions.type = "GET";
  ajaxOptions.url = "/news/listing/" + getUserName() + "/" + currFavPage +"/";
  ajaxOptions.success = function(data){
    updateNewsListing(data, '#favoriteNews');
  }
  $.ajax(ajaxOptions);
}