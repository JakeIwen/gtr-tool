

var numFrets = 16;
var zeroFretLength = 25;
var fretWidth = 3;
var app = angular.module('app', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: '/views/templates/home.html',
    controller: 'HomeController',
    controllerAs: 'home'
  })
  .when('/caged' ,{
    templateUrl: '/views/templates/caged.html',
    controller: 'CagedController',
    controllerAs: 'caged'
  })
  .when('/triad' ,{
    templateUrl: '/views/templates/triad.html',
    controller: 'TriadController',
    controllerAs: 'triad'
  })
  .when('/text' ,{
    templateUrl: '/views/templates/text.html',
    controller: 'TextController',
    controllerAs: 'text'
  })
  .otherwise({
    redirectTo: 'home'
  });

}]);


// Home controller
app.controller('HomeController', function($http) {
  console.log('home controller running');
  var self = this;

});
