var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var Twit = require('twit');
var io = require('socket.io')(http);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static(__dirname + '/public'));


// Twitter
var watchList = ['#jsdayrec', '#jsdayrecife', '#jsday', '#TwitterRealtime'];

var twitter = new Twit({
  consumer_key: 'zgQov9UMoXWwGywxOC0PVuhBc',
  consumer_secret: 'CIjamtfHT919nWjaBk2eRrO62yUQnrdN5aNuBUtWJaCTHNkrep',
  access_token: '2679661020-aSXQaLr4Q79MNjUXnWBVtkMj7WYs5SbUv6qhfBt',
  access_token_secret: '3K3PVh4uzMx5lav0UWQa4pHqMo42T6PXuyM9hBWcIBfpA'
});

// Sample locations
var locations = {
  sf: '-122.75,36.8,-121.75,37.8',
  nyc: '-74,40,-73,41',
  all: '-180,-90,180,90'
};

// Socket
io.sockets.on('connection', function(socket) {
  console.log('Connected');

  var stream = twitter.stream('statuses/filter', { locations: locations.all });

  stream.on('tweet', function(tweet) {
    //only process tweets that have coordinates

    var tweetJSON = {
      text: tweet.text,
      name: tweet.user.screen_name,
      image: tweet.user.profile_image_url,
    };

    if(tweet.geo)
      tweetJSON.location = tweet.geo.coordinates;

    io.sockets.emit('stream', tweetJSON);

    console.log('---');
    console.log('screen_name:', tweet.user.screen_name);
    console.log('text:', tweet.text);

  });
});
