var app = angular.module('myApp', ['ngRoute']);

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
    .otherwise({
      redirectTo: 'home'
    });

}]);
// Home controller
app.controller('HomeController', function() {
  console.log('home controller running');
  var self = this;
  self.message = "Home controller is the bestest!";

});
// Caged controller
app.controller('CagedController', ["$http", function($http) {
  console.log('caged controller running');
  var self = this;

  self.letterNote 

  self.guitar = new Guitar();
  console.log('this guitar:', self.guitar);

}]);
