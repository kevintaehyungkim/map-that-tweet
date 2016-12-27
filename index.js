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
  consumer_key: 'z4ebhQjySYZcu5aIHUqKgPJiZ',
  consumer_secret: '4kVt3glKRLd9dLHIKSi578s4aoZUfmyTwvfonIoXsajOpVWkzF',
  access_token: '365489318-9syC9NODIhM5vAalAGTrz9W9THf8ToZ2Jmh6baty',
  access_token_secret: 'OrGLZBFCgSjPqSdbU1LTsSsbKGfszRGyytEfJ9iVmo3q7'
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

    console.log('---');
    console.log('screen_name:', tweet.user.screen_name);
    console.log('text:', tweet.text);
    console.log(tweet.geo.coordinates);

    var tweetJSON = {
      text: tweet.text,
      name: tweet.user.screen_name,
      image: tweet.user.profile_image_url,
      location: tweet.geo.coordinates
    };

    io.sockets.emit('stream', tweetJSON);

  });
});
