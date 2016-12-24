app.controller('CagedController', ["$http", function($http) {
  var self = this;
  self.tonicList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G#', 'A', 'A#', 'B'];
  
  self.neck = new Guitar();
  self.neck.frets_shown = 15;

  getScales();
  self.tonic = 'C';
  self.init = function(){
    if(self.scale && self.tonic) {
      show();
    }
  }

  function show() {
    console.log('caged.tonic', self.tonic);
    var scale = self.scale.notes;
    var degrees = self.scale.degrees;
    //cycle through all fretboard elements and comare midi note to calculated scale notes
    $('.marker').attr('src', "../img/empty.svg");
    console.log('scale, degrees', scale, degrees);
    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      for (var i = 0; i < scale.length; i++) {
        var thisNote = (scale[i] + note(self.tonic).pos) % 12;
        if (thisNote == $fretMidiNote % 12) {
          $fret.attr('src', "../img/" + degrees[i] + ".svg");
        }
      }
    });
  }

  function convertList(scaleArray) {
    //turn mongoDb data into array of scale objects
    self.scales = [];
    for (var i = 0; i < scaleArray.length; i++) {
      var obj = {
        name: scaleArray[i].longName,
        notes: scaleArray[i].notes,
        degrees: scaleArray[i].degrees
      };
      self.scales.push(obj);
    }  //set default scale
    self.scale = self.scales[0];
    console.log('self.scalenames', obj);
    show();
  }

  self.noteName = function(pos) {
    console.log('pos, notename', pos, MUSIQ.sharpNames[self.scale.notes[pos - 1]]);
    return MUSIQ.sharpNames[self.scale.notes[pos - 1]];

  }

  function getScales() {
    //ajax call to get scales from MongoDb
    $http.get('/scales/')
    .then(function(response) {
      console.log('getnames response', response.data);
      convertList(response.data);;
    },
    function(response) {
      console.log('get error:', response);
    });
  }
}]);
