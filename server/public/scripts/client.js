

var numFrets = 16;
var zeroFretLength = 25;
var fretWidth = 3;
var app = angular.module('app', ['ngRoute']);

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
  .otherwise({
    redirectTo: 'home'
  });

}]);

//this factory is not used currently
app.factory('Factory', ["$http", function($http){
  console.log('factory running');
  var fretLocations = [];
  var fretSpacings = [];

  function fretMap() {
    var fretName = '.fretNum0'
    var i=0;
    console.log('fretNum0', $(fretName).width());
    while ($(fretName).width()) {
      fretLocations[i] = 0;
      fretSpacings[i] = $(fretName).width();
      for (var j = 0; j < fretSpacings.length; j++) {
        //fret locations are the sum of fret spacings up to the given fret (index)
        fretLocations[i] += fretSpacings[j];
      }
      i++;
      fretName = '.fretNum' + i;
      console.log('Factory fretlocations:', fretLocations[i]);
      console.log('fretNum', i, $(fretName).width());
    }
    return fretLocations;
  }
  return {
    fretMap: function() {return fretMap();},
    fretLocations: function() {return fretLocations;}
  }


}]);

// Home controller
app.controller('HomeController', function() {
  console.log('home controller running');
  var self = this;
});
