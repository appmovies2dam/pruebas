var demoApp = angular.module('starter', ['ionic']);


demoApp.factory('Movies', function($http) {
  var cachedData;

  function getData(moviename, callback) {

    var url = 'http://api.themoviedb.org/3/',
      mode = 'search/movie?query=',
      name = '&query=' + encodeURI(moviename),
      key = '&api_key=5fbddf6b517048e25bc3ac1bbeafb919';
      language='&language=es';

    $http.get(url + mode + key + language + name).success(function(data) {

      console.log(JSON.stringify(data));

      cachedData = data.results;
      callback(data.results);
    });
  }

  return {
    list: getData,
    find: function(name, callback) {
      console.log(name);
      var movie = cachedData.filter(function(entry) {
        return entry.id == name;
      })[0];
      callback(movie);
    }
  };

});


demoApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url: '/',
      templateUrl: 'list.html',
      controller: 'ListCtrl'
    })
    .state('view', {
      url: '/movie/:movieid',
      templateUrl: 'view.html',
      controller: 'ViewCtrl'
    });

  $urlRouterProvider.otherwise("/");

});

demoApp.controller('ListCtrl', function($scope, $http, Movies) {

  $scope.movie = {
    name: ''
  }

  $scope.searchMovieDB = function() {

    Movies.list($scope.movie.name, function(movies) {
      $scope.movies = movies;
    });
    
  };
});

demoApp.controller('ViewCtrl', function($scope, $http, $stateParams, Movies,$ionicHistory) {
  Movies.find($stateParams.movieid, function(movie) {
    $scope.movie = movie;
  });
  $scope.volver = function(){
    $ionicHistory.goBack();
  }
});