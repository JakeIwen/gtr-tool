app.controller('CagedController', ["$http", function($http) {
  var self = this;
  var tonic = 'C';
  self.tonicList = ['C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B', 'C♭'];

  self.neck = new Guitar();
  self.neck.frets_shown = 15;
  var a = Scale.fromTonicAndType('C', 'Major');
  console.log('a', a);
  console.log('neck', self.neck);

  getScales();
  self.tonic = 'C';
  self.init = function(){
    if (self.scale && self.tonic) {
      self.show();
    }
  }



  self.show = function() {
    tonic = self.tonic.replace("♭","b").replace("♯", "#");
    console.log('caged.tonic', tonic);
    var scale = self.scale.notes;
    var degrees = self.scale.degrees;
    //cycle through all fretboard elements and comare midi note to calculated scale notes
    $('.marker').attr('src', "../img/empty.svg");
    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      $string = $(this).data('string');
      for (var i = 0; i < scale.length; i++) {
        var thisNote = (scale[i] + note(tonic).pos) % 12;
        if ((thisNote == $fretMidiNote % 12) && self.active[$string]) {
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
    self.show();
  }

  self.noteName = function(pos, notation) {
    //relative circle of fifths positions to determine if # or flat is correct notation
      var root = Note.fromNotation(tonic);
      console.log('root', root, root.cofPosition());
      console.log('pos ', pos,  self.scale.notes);
      if (root.cofPosition() < 6) {
        var ret = MUSIQ.sharpNames[(self.scale.notes[pos] + note(tonic).pos) % 12];
      } else {
        var ret = MUSIQ.flatNames[(self.scale.notes[pos] + note(tonic).pos) % 12];
      }
      if(notation){
        ret = ret.replace("b","♭").replace("#","♯");
      }
      return ret;
  }

  function getScales() {
    //ajax call to get scales from JSON
    $http.get('/scales/')
    .then(function(response) {
      convertList(response.data);
    },
    function(response) {
      console.log('get error:', response);
    });
  }
}]);
