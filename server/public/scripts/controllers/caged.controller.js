app.controller('CagedController', ["$http", function($http) {
  var self = this;


  self.scales = [];

  getScales();

  self.init = function(){
    if(self.scale && self.tonic) {
      filter();
    }
  }

  function filter() {
    //insert /blanks' to make all scales eight notes
    var scale = self.scale.notes;
    if(scale.length == 3) {
      scale.splice(4, 0, null);
      scale.splice(7, 0, null);
    }
    if(scale.length == 5) {
      scale.splice(1, 0, null);
      scale.splice(5, 0, null);
    }
    show(scale);
  }

  function show(scale) {
    //cycle through all fretboard elements and comare midi note to calculated scale notes
    $('.marker').attr('src', "../img/empty.svg");
    console.log('scale', scale);
    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      for (var i = 0; i < scale.length; i++) {
        var thisNote = (scale[i] + note(self.tonic).pos) % 12;
        if (thisNote == $fretMidiNote % 12) {
          $fret.attr('src', "../img/" + (i + 1) + ".svg");
        }
      }
    });
  }

  function convertList(scaleArray) {
    //turn mongoDb data into array of scale objects
    for (var i = 0; i < scaleArray.length; i++) {
      var obj = {
        name: scaleArray[i].longName,
        notes: scaleArray[i].notes
      };
      self.scales.push(obj);
    }
    console.log('self.scalenames', obj);
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
