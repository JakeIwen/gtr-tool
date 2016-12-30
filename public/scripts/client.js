

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
app.controller('HomeController', function($firebaseAuth, $http) {
  console.log('home controller running');
  var auth = $firebaseAuth();

  var self = this;
  var currentUser = {};
  //This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  }

  auth.$onAuthStateChanged(function(firebaseUser){
    console.log('authentication state changed');
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      currentUser = firebaseUser;
      // This is where we make our call to our server
      currentUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/users',
          data: self.newUser,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log('response:', response);
        });
      });




      currentUser.getToken().then(function(idToken){
        console.log('getting song list');
        $http({
          method: 'GET',
          url: '/songs/titles',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.songList = response.data;
          console.log('self.songList', self.songList);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.songList = [];
    }

  });
});
