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
  console.log('C chord', chord('C7'));


  $(document).ready(function() {
    console.log('up and running!');

  });

  self.newChord = function() {
    console.log('cagedChord:', self.cagedChord);


    var selectedChord = chord(self.cagedChord);
    console.log('selectedChord', selectedChord);
    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      // if(contains(selectedChord, $fretMidiNote)){
      var notes = selectedChord.notes;
      console.log($fretMidiNote);
      switch($fretMidiNote % 12) {
        case notes[0]:
          $fret.attr('src', "../img/root.svg");
          break;
        case notes[1]:
          $fret.attr('src', "../img/third.svg");
          break;
        case notes[2]:
          $fret.attr('src', "../img/fifth.svg");
          break;
        default:
          $fret.attr('src', "../img/empty.svg");
      }
    });
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
  };



}]);
