//Change my address based off of server machine ip
var socket = io.connect("http://128.237.224.59:8888");

//given a message will add it to the live game listing
var addSocketMessage = function(msg, isOfficial, username){
  if (msg === undefined)
    return;
  var newmsg = $('<div>');
  var msgText = $('<span>');

  //if user message add in username to msg text
  if (!isOfficial){
    var usernameSpan = $('<span>');
    usernameSpan.html(username);
    usernameSpan.css('font-weight', 'bold');

    msgText.html(usernameSpan);
    msgText.append(' : ' + msg);
  }
  else{
    msgText.text(msg);
  }
  
  msgText.addClass('msgText');
  var user = $('<div>');
  user.addClass('username');
  
  //add mlb logo if official
  if (!!isOfficial){
    var thumbnail = $('<img>');
    thumbnail.attr('width', '50');
    thumbnail.attr('height', '50');
    thumbnail.attr('position', 'absolute');
    thumbnail.attr('top', '15%');
    thumbnail.attr('src', 'http://s4.evcdn.com/images/medium/I0-001/013/092/603-9.jpeg_/mlb-exhibition-game-seattle-mariners-vs-colorado-r-03.jpeg');
    user.append(thumbnail);
  }

  newmsg.append(user);
  newmsg.addClass('newsItem');
  newmsg.addClass('foobar');
  newmsg.append(msgText);
  $('#liveGameUpdates').prepend(newmsg);
}

socket.on("newmsg", function(data) {
  if (data.msg === '')
    return;
  addSocketMessage(data.msg, false, data.username);
});


socket.on('gameUpdate', function(data){
  addSocketMessage(data.msg, true);
});


window.addEventListener('load', function(){
  var submitMsg = $('#submitMessage');
  submitMsg.onButtonTap(function () {
    var msg = $('#liveGameMessage').val();
    var username = getUserName();
    if (username === ''){
      username = 'Anonymous';
    }
    socket.emit('msg', {msg : msg, username: username, gameIdx: gameIdx});
    $('#liveGameMessage').val('');
  })
})
