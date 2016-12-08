//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", 'Factory', function($http, Factory) {
  console.log('Triad controller running');
  var self = this;
  var slider = document.getElementById('slider');
  var fretNoteRelation = [];
  var fretElementSets = [];
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
      $fretMidiNote = $(this).data('midi');
      //set notes to array of notes contained in selected chord
      var notes = self.selectedChord.notes;
      switch($fretMidiNote % 12) {
        case notes[0]:
          $fret.attr('src', "../img/root.svg");
          fretNoteRelation[i] = {
            stringFret: $fret.data('stringfret'),
            midiNote: $fretMidiNote,
            relation: 'R'
          }
          i++;
          break;
        case notes[1]:
          $fret.attr('src', "../img/third.svg");
          fretNoteRelation[i] = {
            stringFret: $fret.data('stringfret'),
            midiNote: $fretMidiNote,
            relation: '3'
          }
          i++;
          break;
        case notes[2]:
          $fret.attr('src', "../img/fifth.svg");
          fretNoteRelation[i] = {
            stringFret: $fret.data('stringfret'),
            midiNote: $fretMidiNote,
            relation: '5'
          }
          i++;
          break;
        default:
          $fret.attr('src', "../img/empty.svg");
      }

    });

    self.findTriads = function() {
      
    }
  };

  self.findTriads = function() {
    console.log('frind triads; fretNoteRelation', fretNoteRelation);
    for (var i = 0; i < fretNoteRelation.length; i++) {
      if(fretNoteRelation[i].relation == 'R'){
        for (var j = 0; j < fretNoteRelation.length; j++) {
          if(fretNoteRelation[j].relation == '3'){
            for (var k = 0; k < fretNoteRelation.length; k++) {
              if(fretNoteRelation[k].relation == '5') {
                fretElementSets.push([fretNoteRelation[i].element, fretNoteRelation[j].element, fretNoteRelation[k].element]);
              }
            }
          }
        }
      }
    }
  }

  self.displayTriad = function() {

  }
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
