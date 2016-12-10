//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", 'Factory', function($http, Factory) {
  console.log('Triad controller running');
  var self = this;
  var slider = document.getElementById('slider');
  var fretNoteRelation = [];
  var activeDOMSets = [];
  var masterSet = [];
  var notes = [];
  self.triadIndex = 0;

  //finger-stretch dropdown menu


  self.newChord = function() {
    //self.getFrets();
    console.log('Chord:', self.triadChord);

    self.selectedChord = chord(self.triadChord);
    console.log('selectedChord', self.selectedChord);
    var i=0;
    $('.marker').each(function() {
      $fretMidiNote = $(this).data('midi');
      fretNoteRelation[i] = {
        stringFret: $(this).data('stringfret'),
        midiNote: $fretMidiNote,
      }
      //set notes to array of notes contained in selected chord
      notes = self.selectedChord.notes;
      for (var j = 0; j < notes.length; j++) {
        if(notes[j] == $fretMidiNote % 12) {
          fretNoteRelation[i].relation = svgRelations[j];
          i++;
        }
      }
    });

    self.findTriads();
    self.filter();

  };

  self.findTriads = function() {
    activeDOMSets = [];
    //fretNoteRelation contains every DOM '.marker' element that is contained in the selected chord
    //this function seperates them into single playable chords

    //Find the first 'root' note in fretNoteRelations at fretNoteRelations[i]
    //Find the first 'third' note in fretNoteRelations at fretNoteRelations[j]
    //Find the first 'fifth' note in fretNoteRelations at fretNoteRelations[k]
    //First triad has been identified. Save the triad [fretNoteRelations[i], fretNoteRelations[j], fretNoteRelations[k]].

    //Find the next 'fifth' at fretNoteRelations[k]. Save this triad.
    //Find all remaining fifths and save each.

    //Find next third. Find all fifths and save.
    //find all remaining thirds and fifths and save

    //find next root. repeat 


    //create an array activeDOMSets containing sets of 3 or more notes representing the chord/triad
    //these are the sets that will be displayed, one-at-a-time on the DOM
    //the if statements check to make sure the notes are on different strings
    console.log('frind triads; fretNoteRelation', fretNoteRelation);
    var numRelations = self.selectedChord.notes;
    //loops will be nested for numRelations.length levels. this is the number of notes in the chosen chord
    for (var i = 0; i < fretNoteRelation.length; i++) {
      if(fretNoteRelation[i].relation == svgRelations[0]){
        for (var j = 0; j < fretNoteRelation.length; j++) {
            //IF the note relation is 'fifth' AND it is on a different string than the root note from above loop
          if(fretNoteRelation[j].relation == svgRelations[1] && (fretNoteRelation[i].stringFret[0] != fretNoteRelation[j].stringFret[0])){
            for (var k = 0; k < fretNoteRelation.length; k++) {
              //IF the note relation is 'third' AND it is on a different string than both the root and third notes from above loops
              if(fretNoteRelation[k].relation == svgRelations[2] && (fretNoteRelation[i].stringFret[0] != fretNoteRelation[k].stringFret[0]) && (fretNoteRelation[j].stringFret[0] != fretNoteRelation[k].stringFret[0])) {
                  //I would like to add one or more nested loops for more complex chords (7ths etc)
                  //send DOM corrdinates which get matched with $('marker').data(stringfret) in displayTriad().
                  activeDOMSets.push([fretNoteRelation[i].stringFret, fretNoteRelation[j].stringFret, fretNoteRelation[k].stringFret]);
              }
            }
          }
        }
      }
    }
    masterSet = cloneTwoDimArray(activeDOMSets);
    console.log('masterSet', masterSet);
  };

  self.filter = function() {
    var stretch = self.chordSpan.selectedSpan.span;
    var clusters = [];
    console.log('stretch', stretch);
    activeDOMSets = cloneTwoDimArray(masterSet);
    for (var i = 0; i < activeDOMSets.length; i++) {
      //string each note is on
      var triadFrets = [];
      var triadStrings = [];

      //store fret and string arrangement of this note group into seperate arrays
      for (var j = 0; j < activeDOMSets[i].length; j++) {
        //the strings to be played
        triadStrings.push(activeDOMSets[i][j][0]);
        //dont include open strings if user has selected allowOpen
        if(!(self.allowOpen && (activeDOMSets[i][j][1] == 0))) {
          triadFrets.push(activeDOMSets[i][j][1]);
        }
      }
      //will not include open strings if self.allowOpen checkbox == true (see above)
      var fretSpan = Math.max(...triadFrets) - Math.min(...triadFrets);
      //the span of played strings (smaller is more desireable because there are no open strings to mute in between the strings to be played)
      var clusterSize = Math.max(...triadStrings) - Math.min(...triadStrings);
        if (fretSpan <= stretch){
          //if within range of user-specified fret span
          //populate array of triad formations AND corresponding string-spans
          clusters.push({
            clusterSize: clusterSize,
            elementSet: activeDOMSets[i]
           });
        }
    }
    //add 3-string clusters to beginning of list
    activeDOMSets = [];
    //organize variations by tightest set of strings
    //(no unplayed strings within triad)
    //number of notes in chord ('triad') (-1 for array notation)
    smallestCluster = self.selectedChord.notes.length - 1;
    if(self.onlyClusters) {
      //only one iteration of outer loop below avoids string-gaps
      maxCluster = smallestCluster;
    } else {
      maxCluster = 6; //max span = number of strings on guitar
    }
      //push configurations to
      for (var clusterSize = smallestCluster; clusterSize <= maxCluster; clusterSize++) {
        for (var i = 0; i < clusters.length; i++) {
          if(clusters[i].clusterSize == clusterSize) {
            //search whole cluster array and push to elementSet array, smallest clusters first
            activeDOMSets.push(clusters[i].elementSet);
          }
        }
      }
    //DOM binding listing number of chord variations
    self.variations = activeDOMSets.length;
    //console.log('activeDOMSets', activeDOMSets);
    self.triadIndex = 0;
    self.displayTriad();
  };

  self.displayTriad = function() {
    if(activeDOMSets[0] == undefined) {
      //TODO: choose way to back out of error state
      alert('No Chord Configurations Available');
      return 0; //exit function
    }

    //the thisTriad variation dictated by prev/next buttions
    var thisTriad = activeDOMSets[self.triadIndex];
    console.log('This triad:', thisTriad);
    $('.marker').each(function() {
      $fret = $(this);
      $fretCoord = $(this).data('stringfret');
      $fret.attr('src', svgSources[svgSources.length - 1]);
      for (var i = 0; i < thisTriad.length; i++) {
        if(thisTriad[i] == $fretCoord) {
          $fret.attr('src', svgSources[i]);
          break;
        }
      }
    });
  };

  self.nextVar = function() {
    self.triadIndex++;
    if (self.triadIndex > activeDOMSets.length - 1) {
      self.triadIndex = 0;
    }
    self.displayTriad();
  }

  self.prevVar = function() {
    self.triadIndex--;
    if (self.triadIndex < 0) {
      self.triadIndex = activeDOMSets.length - 1;
    }
    self.displayTriad();
  }
  var svgSources = [
    //indicies correspond with that of thisTriad, activeDOMSets[];
    "../img/root.svg",
    "../img/third.svg",
    "../img/fifth.svg",
    "../img/alt.svg",
    "../img/empty.svg"
  ]
  var svgRelations = [
    'root',
    'third',
    'fifth',
    'alt',
    'empty'
  ]
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

  noUiSlider.create(sliderBar, {
  	start: [20, 80],
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 100
  	}
  });

  //x-position of each fret for slider-bar functionality
  // self.getFrets = function() {
  //       self.sliderSnaps = Factory.fretMap();
  //       console.log('self.sliderSnaps:', self.sliderSnaps);
  //     };

  function cloneTwoDimArray(arr) {
    // Deep copy arrays. Going one level deep seems to be enough.
    var clone = [];
    for (i=0; i<arr.length; i++) {
      clone.push( arr[i].slice(0) )
    }
    return clone;
  }

}]);
