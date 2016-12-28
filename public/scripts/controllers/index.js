'use strict';

/**
 * @ngdoc function
 * @name twRealtime.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the twRealtime
 */
 
angular.module('twRealtime')
  .controller('IndexCtrl', ['$scope', 'TwitterService', function ($scope, TwitterService) {

    $scope.projectName = 'Map that Tweet';
    $scope.description = 'Visualize Twitter Updates in Real-Time';
    $scope.feeds = [];

    TwitterService.getFeeds(function(data) {
      $scope.showTweets(data.text, data.name, data.image);

      //If the tweet has geo-location
      if(data.location)
        $scope.showMapTweet(data.text, data.name, data.image, data.location);
    });

    var socket, geocoder, 
        myLatlng, mapOptions, infowindow, map, 
        marker, styles, styledMap, notification, options;

    var markers = [];

    $scope.geolocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showMap, $scope.errorGeolocation);
      } else {
        alert('Your browser does not support geolocation');
      }
    };

    $scope.showMap = function(position) {

      // Center coordinates of world map
      myLatlng = new google.maps.LatLng(42.606466, -0.323780);

      // Google Maps Options
      mapOptions = {
        zoom: 2,
        center: myLatlng,
        panControl: false,
        scrollwheel: false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_devfestne']
        }
      }

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-32.png'
      });

      infowindow.open(map, marker);

      // Map Stylization
      styles = [
        {
          stylers: [
            { "invert_lightness": false },
            { "weight": 0.3 },
            { lightness: 0 },
            { gamma: 0 }
          ]
        },
        {
          "elementType": "geometry.stroke",
          "stylers": [
            { "lightness": -29 },
            { "visibility": "on" },
            { "saturation": 1 },
            { "invert_lightness": true },
            { "hue": "#eeff00" },
            { "color": "#fbbc05" }
          ]
        },
        {
          "elementType": "labels.text",
          "stylers": [
            { "visibility": "on" },
            { "color": "#4581F2" },
            { "weight": 0.3 }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            { "weight": 0.3 },
            { "visibility": "off" }
          ]
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [
            { "visibility": "simplified" }
          ]
        }
      ];

      styledMap = new google.maps.StyledMapType(styles, {
        name: "TwitterRealtime"
      });

      // Map Configurations
      map.mapTypes.set('map_devfestne', styledMap);
      map.setMapTypeId('map_devfestne');

      geocoder = new google.maps.Geocoder();
    };

    $scope.errorGeolocation = function(msg) {
      alert('There was an error in geolocation: ', msg);
    };

    $scope.geolocation();

    $scope.showMapTweet = function(text, name, image, location) {

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(location[0], location[1]),
        map: map,
        //drop animation might cause slowing
        animation: google.maps.Animation.DROP,
        icon: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-32.png'
      });

      marker.setMap(map);

      // Remove old markers when there are more than 300 on the map.
      if (markers.length > 300) {
        markers[0].setMap(null);
        markers.shift();
      }

      markers.push(marker);

      $scope.openNofify(name, text, image);
    };

    $scope.openNofify = function(title, body, icon) {
      options = {
        body: body,
        icon: icon
      };

      if (!("Notification" in window)) {
        alert('Your browser does not support notifications.');
      } else if (Notification.permission === 'granted') {
        notification = new Notification(title, options);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          if (permission === 'granted') {
            notification = new Notification(title, options);
          }
        });
      }
    };

    $scope.showTweets = function(text, name, image) {
      var data = {
        text: text,
        name: name, 
        image: image
      }

      $scope.$apply(function() {
        $scope.feeds.push(data);
      });
    };

  }]);
