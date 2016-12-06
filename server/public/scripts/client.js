//auto exe of fret sizing
//ng-show or jQuery
//ng-everything or jQuery
//z-values
//hide icon and move next forward OR best way to use different SVG markers
//multi controllers on one page? - one for building fretboard used on both app pages
//add play status to fret and

//ng-if or show
//sass for loop for fret spacing

var numFrets = 16;
var zeroFretLength = 25;
var fretWidth = 3;
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
  self.guitar = new Guitar();
  console.log('this guitar:', self.guitar);
  var fretLocation = [0];
  self.cagedChord = {};

  $(document).ready(function() {
    console.log('up and running!');
    // $('body').click(function() {
      spaceFrets();
    // });

    function spaceFrets() {
      console.log('spacing frets');
      //find better formula for frets/string length
      var stringLength = $('body').width();
      console.log('string length in px:', stringLength);
      //spacebehind he zero fret
      $('.fretNum0').width(zeroFretLength);
      var remainingLength = stringLength;

      for (var i = 1; i < self.guitar.frets.length; i++) {
        var fretLength = 0;
        var fretNum = ".fretNum" + i;

        $(fretNum).each(function() {
          var $el = $(this);
          //formula for fret spacing
          fretLength = remainingLength/18;
          //set spacing
          $el.width(fretLength);
          console.log('length of ', $el.attr('class'), $el.width());
        });
        remainingLength -= fretLength;
        fretLocation.push(stringLength - remainingLength + fretWidth);
      }
      console.log('marker locations', fretLocation);
    }
  });

  $('#cagedChord').change( function() {
    console.log('cagedChord:', self.cagedChord);

  //   for (var i = 1; i < self.guitar.frets.length; i++) {
  //     var fretLength = 0;
  //     var fretNum = ".fretNum" + i;
  //
  //     $(fretNum).each(function() {
  //       var $el = $(this);
  //       //formula for fret spacing
  //       fretLength = remainingLength/18;
  //       //set spacing
  //       $el.width(fretLength);
  //       console.log('length of ', $el.attr('class'), $el.width());
  //     });
  //     remainingLength -= fretLength;
  //     fretLocation.push(stringLength - remainingLength + fretWidth);
  //   }
  //
  });



}]);
