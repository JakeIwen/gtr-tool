//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", 'Factory', function($http, Factory) {
  console.log('Triad controller running');
  var self = this;
  var slider = document.getElementById('slider');
  var fretNoteRelation = [];
  var fretElementSets = [];
  var masterSet = [];
  self.triadIndex = 0;

  //finger-stretch for
  self.chordSpan = {
    spans: [
      {span: 0},
      {span: 1},
      {span: 2},
      {span: 3},
      {span: 4},
      {span: 5}],
      selectedSpan: {span: 3}
      };

  self.newChord = function() {
    self.getFrets();
    console.log('triadChord:', self.triadChord);

    self.selectedChord = chord(self.triadChord);
    console.log('selectedChord', self.selectedChord);
    var i=0;
    $('.marker').each(function() {
      $fret = $(this);
      $fretCoord = $(this).data('stringfret');
      $fretMidiNote = $(this).data('midi');
      //set notes to array of notes contained in selected chord
      var notes = self.selectedChord.notes;
      fretNoteRelation[i] = {
        stringFret: $fretCoord,
        midiNote: $fretMidiNote,
      }
      switch($fretMidiNote % 12) {
        case notes[0]:
          $fret.attr('src', "../img/root.svg");
          fretNoteRelation[i].relation = 'R';
          i++;
          break;
        case notes[1]:
          $fret.attr('src', "../img/third.svg");
          fretNoteRelation[i].relation = '3';
          i++;
          break;
        case notes[2]:
          $fret.attr('src', "../img/fifth.svg");
          fretNoteRelation[i].relation = '5';
          i++;
          break;
        default:
          $fret.attr('src', "../img/empty.svg");
      }
    });

    self.findTriads();
    self.filter();
    self.displayTriad();

  };

  self.findTriads = function() {
    //the if statements check to make sure the notes are on different strings
    console.log('frind triads; fretNoteRelation', fretNoteRelation);
    for (var i = 0; i < fretNoteRelation.length; i++) {
      if(fretNoteRelation[i].relation == 'R'){
        for (var j = 0; j < fretNoteRelation.length; j++) {
          if(fretNoteRelation[j].relation == '3' && (fretNoteRelation[i].stringFret[0] != fretNoteRelation[j].stringFret[0])){
            for (var k = 0; k < fretNoteRelation.length; k++) {
              if(fretNoteRelation[k].relation == '5' && (fretNoteRelation[i].stringFret[0] != fretNoteRelation[k].stringFret[0]) && (fretNoteRelation[j].stringFret[0] != fretNoteRelation[k].stringFret[0])) {
                  fretElementSets.push([fretNoteRelation[i].stringFret, fretNoteRelation[j].stringFret, fretNoteRelation[k].stringFret]);
              }
            }
          }
        }
      }
    }
    masterSet = fretElementSets;
  };

  self.filter = function() {
    var stretch = self.chordSpan.selectedSpan.span;
    console.log('stretch', stretch);
    fretElementSets = masterSet;
    for (var i = 0; i < fretElementSets.length; i++) {
        var fret1 = fretElementSets[i][0][1];
        var fret2 = fretElementSets[i][1][1];
        var fret3 = fretElementSets[i][2][1];
        //compare distances between frets of noteset
      if((Math.abs(fret1 - fret2) > stretch) || (Math.abs(fret2 - fret3) > stretch) || (Math.abs(fret3 - fret1) > stretch)) {
        //console.log('removed by filter:', fretElementSets[i]);
        fretElementSets.splice(i, 1);
        i--;
      }
    }
    self.variations = fretElementSets.length;
  };

  self.nextVar = function() {
    self.triadIndex++;
    if (self.triadIndex > fretElementSets.length - 1) {
      self.triadIndex = 0;
    }
    self.filter();
    self.displayTriad();
  }

  self.prevVar = function() {
    self.triadIndex--;
    if (self.triadIndex < 0) {
      self.triadIndex = fretElementSets.length - 1;
    }
    self.filter();
    self.displayTriad();
  }

  self.displayTriad = function() {
    var thisTriad = fretElementSets[self.triadIndex];
    $('.marker').each(function() {
      $fret = $(this);
      $fretCoord = $(this).data('stringfret');
        if(thisTriad[0] == $fretCoord) {
          $fret.attr('src', "../img/root.svg");
        } else if (thisTriad[1] == $fretCoord) {
          $fret.attr('src', "../img/third.svg");
        } else if (thisTriad[2] == $fretCoord) {
          $fret.attr('src', "../img/fifth.svg");
        } else {
          $fret.attr('src', "../img/empty.svg");
        }
    });
  };

  noUiSlider.create(sliderBar, {
  	start: [20, 80],
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 100
  	}
  });

  //x-position of each fret for slider-bar functionality
  self.getFrets = function() {
        self.sliderSnaps = Factory.fretMap();
        console.log('self.sliderSnaps:', self.sliderSnaps);
      };


}]);
