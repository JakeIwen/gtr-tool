var app = angular.module('app', ['ngRoute', 'firebase', 'ng-files-model', 'angularModalService']);

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




/***************************ANGULAR SEARCH FILTERS***************************/
app.filter('startFrom', function() {

  return function(input, start) {
    if (start == undefined)
      start = 0;
    if (input == undefined )
      input = [];
    // console.log('input, start', input, start);
    start = +start; //parse to int
    return input.slice(start);
  };
});

app.filter('excludeByStatus', function () {
  return function (items, excludedList) {
    var ret = [];
    angular.forEach(items, function (item) {
      if (excludedList.indexOf(item.status) === -1) {
          ret.push(item);
      }
    });
    return ret;
  };
});

app.filter('true_false', function() {
    return function(text, length, end) {
        if (text) {
            return 'Yes';
        }
        return 'No';
    };
});
/**********************CUSTOM ANGULAR DIRECTIVES******************************/

/***************************UTILITY FUNCTIONS***************************/
function removeObjById(arr, id) {
  var idx = arr.findIndex(item => item.id === id);
  ~idx && arr.splice(idx, 1);
  return idx;
}
// Home controller
app.controller('HomeController', function($http) {
  console.log('home controller running');
  var self = this;
});
