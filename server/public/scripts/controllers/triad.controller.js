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
    masterSet = cloneTwoDimArray(fretElementSets);
  };

  self.filter = function() {
    var stretch = self.chordSpan.selectedSpan.span;
    var allowOpen = self.allowOpen;
    var clusters = [];
    console.log('stretch', stretch);
    fretElementSets = cloneTwoDimArray(masterSet);
    for (var i = 0; i < fretElementSets.length; i++) {
        //fret position of each triad note
        var fret1 = fretElementSets[i][0][1];
        var fret2 = fretElementSets[i][1][1];
        var fret3 = fretElementSets[i][2][1];

        //compare distances between frets of note-set to user selected span
        var overSpan12 = (Math.abs(fret1 - fret2) > stretch);
        var overSpan23 = (Math.abs(fret2 - fret3) > stretch);
        var overSpan31 = (Math.abs(fret3 - fret1) > stretch);

        //string each note is on
        var string1 = fretElementSets[i][0][0];
        var string2 = fretElementSets[i][1][0];
        var string3 = fretElementSets[i][2][0];
        var lowestString = Math.min(string1, string2, string3);

        //nomalize to lowest string
        string1 -= lowestString;
        string2 -= lowestString;
        string3 -= lowestString;

        //Bools representing note-pairs on consecutive strings
        var stringSpan12 = (Math.abs(string1 - string2) == 1);
        var stringSpan23 = (Math.abs(string2 - string3) == 1);
        var stringSpan31 = (Math.abs(string3 - string1) == 1);

        if(allowOpen){
          //if user allows open strings
          //fret values of 0 will be allowed in any triad configuration
          switch (0) {
            case fret1:
              overSpan12 = false;
              overSpan31 = false;
              break;
            case fret2:
              overSpan12 = false;
              overSpan23 = false;
              break;
            case fret3:
              overSpan23 = false;
              overSpan31 = false;
              break;
          }
        }
        var spanTooLarge = (overSpan12 || overSpan23 || overSpan31);
        var clusterBool = (Math.max(string1, string2, string3) == 2 );
      if(spanTooLarge || clusterBool) {
        if (!spanTooLarge){
          //save 3-string clusters to be pushed to top of array afterwards
          clusters.push(fretElementSets[i]);
        }
        //remove clusters and sets that have a span too large
        fretElementSets.splice(i--, 1);
      }
    }
    //add 3-string clusters to beginning of list
    for (var i = 0; i < clusters.length; i++) {
      fretElementSets.unshift(clusters[i]);
    }
    //DOM binding listing number of chord variations
    self.variations = fretElementSets.length;
    if(self.triadIndex > fretElementSets.length - 1) {
      self.triadIndex = 0;
    }
    self.displayTriad();

  };

  self.nextVar = function() {
    self.triadIndex++;
    if (self.triadIndex > fretElementSets.length - 1) {
      self.triadIndex = 0;
    }
    self.filter();
  }

  self.prevVar = function() {
    self.triadIndex--;
    if (self.triadIndex < 0) {
      self.triadIndex = fretElementSets.length - 1;
    }
    self.filter();
  }

  self.displayTriad = function() {
    var thisTriad = fretElementSets[self.triadIndex];
    console.log('elementsets', fretElementSets);
    console.log('self.triadIndex', self.triadIndex);
    console.log('This triad:', thisTriad);
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


  function cloneTwoDimArray(arr) {
    // Deep copy arrays. Going one level deep seems to be enough.
    var clone = [];
    for (i=0; i<arr.length; i++) {
      clone.push( arr[i].slice(0) )
    }
    return clone;
  }

}]);
