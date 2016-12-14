//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", "$scope", 'Factory', function($http, $scope, Factory) {
  console.log('Triad controller running');
  var self = this;
  var slider = document.getElementById('slider');
  var fretNotes = [];
  var masterSet = [];
  var filteredConfigs = [];
  var notes = [];
  var usedStrings = [];
  var chordFrets = [];
  var inversion = [];
  var noteIndex = 0;
  var fretPositions = [0, 11, 20.5, 29, 37, 44.5, 52, 58.5, 64, 71, 77, 82, 87.5, 92, 96.5, 100];
  var lowLimit = 0;
  var highLimit = 100;
  self.numNotes = 0;


  self.triadIndex = 0;
  self.allowedInversions = [true, true, true, true];
  self.allowedStrings = [true, true, true, true, true, true];

  $('#slider').on("mouseup", function () {

    if(self.selectedChord){
      self.filter();
    }
    $scope.$apply();
  });

  self.toggleInversion = function(index) {
    self.allowedInversions[index] = !(self.allowedInversions[index]);
    if(self.selectedChord){
      self.filter();
    }
  };

  self.toggleString = function(string) {
    self.allowedStrings[string] = !(self.allowedStrings[string]);
    if(self.selectedChord){
      self.filter();
    }
  }
  self.newChord = function() {
    //self.getFrets();
    console.log('Chord:', self.triadChord);

    self.selectedChord = chord(self.triadChord);
    notes = self.selectedChord.notes;
    self.numNotes = notes.length;
    console.log('selectedChord', self.selectedChord);
    var i=0;
    $('.marker').each(function() {
      $fretMidiNote = $(this).data('stringfretmidi')[2];
      //ensure that this fret-note is contained in the selected chord, then add to array of objects describing fret-note location and relation to chord
      if (notes.indexOf(($fretMidiNote % 12)) != -1) {
        fretNotes[i] = {
          stringFretMidi: $(this).data('stringfretmidi'),
          relation: notes.indexOf(($fretMidiNote % 12)),
          // string: $(this).data('stringfret')[0], //not yet used
          // fret: $(this).data('stringfret')[1], //not yet used
          //not yet used
        }
        // $(this).data-noterelation(fretNotes[i]);

        i++;
      }
    });

    findTriads();
    self.filter();

  };

  function findTriads() {
    masterSet = [];
    console.log('frind triads; fretNotes', fretNotes);
    var noteIdx = 0;
    var tmp = [];
    var index = [];
    var strings = [];
    var notes = [];

    for (var i = 0; i < fretNotes.length; i++) {
      //if the string and note are not already used in the chord being constructed
      if(strings.indexOf(fretNotes[i].stringFretMidi[0]) == -1 && notes.indexOf(fretNotes[i].relation) == -1){
        notePush(i);
      }
      //if the temp array contains the correct number of notes, push to master
      if(tmp.length == self.numNotes){
        masterSet.push(tmp.slice());
        i = notePop();
      }
      //traverse back to lower strings
      //if temp arrays are empty the for loop will conditionally terminate
      while(i > fretNotes.length -2) {
        i = notePop();
      }
    }

    //release a note/ string making it available for another
    function notePop() {
      tmp.pop();
      strings.pop();
      notes.pop();
      return index.pop();
    }
    //append arrays containing strings and notes already part of the chord being built
    function notePush(i) {
      strings.push(fretNotes[i].stringFretMidi[0]);
      tmp.push(fretNotes[i].stringFretMidi);
      index.push(i);
      notes.push(fretNotes[i].relation);
    }
    console.log('masterSet', masterSet);
  };



  self.filter = function() {
    var possibleConfigs = [];
    var stretch = self.chordSpan.selectedSpan.span;
    console.log('stretch', stretch);
    for (var i = 0; i < masterSet.length; i++) {
      //fret and string each note is on
      var triadFrets = [];
      var triadStrings = [];
      var triadMidis = [];
      var triadStringFretMidis = [];
      //store fret and string arrangement of this note group into seperate arrays
      for (var j = 0; j < masterSet[i].length; j++) {
        //the strings to be played
        triadStrings.push(masterSet[i][j][0]);
        triadMidis.push(masterSet[i][j][2]);
        triadStringFretMidis.push(masterSet[i][j])
        //dont include open strings if user has selected allowOpen
        if(!(self.allowOpen && (masterSet[i][j][1] == 0))) {
          triadFrets.push(masterSet[i][j][1]);
        }
      }
      var triadFretSpan = Math.max(...triadFrets) - Math.min(...triadFrets);
      //populate array of triad formations AND corresponding string-spans
      if(triadFretSpan <= stretch) {
        possibleConfigs.push({
          stringFretMidis:  triadStringFretMidis,
          //will not include open strings if self.allowOpen checkbox == true (see above)
          fretSpan: triadFretSpan,
          //the span of played strings (smaller is more desireable because there are no open strings to mute in between the strings to be played)
          stringSpan: Math.max(...triadStrings) - Math.min(...triadStrings),
          inversion: triadMidis.indexOf(Math.min(...triadMidis)),
          //elementSet: possibleConfigs[i]
         });
     }
    }
    //add 3-string filteredConfigs to beginning of list
    //possibleConfigs = [];
    filteredConfigs = clusterSort(possibleConfigs);

    //DOM binding listing number of chord variations
    console.log('activedomsets sorted', filteredConfigs);
    //console.log('filteredConfigs', filteredConfigs);
    filteredConfigs = sliderFilter(filteredConfigs);

    filteredConfigs = inversionFilter(filteredConfigs);
    filteredConfigs = stringFilter(filteredConfigs);
    self.variations = filteredConfigs.length;
    console.log('updated self.variations', self.variations);
    self.triadIndex = 0;
    displayTriad();
  };

  function clusterSort(allConfigs) {
    var clusterConfigs = [];
    //organize variations by tightest set of strings
    //(no unplayed strings within triad)
    //number of notes in chord ('triad') (-1 for array notation)
    smallestCluster = notes.length - 1;
    //controlled by user checkbox "only clusters"
    if(self.onlyClusters) {
      //only one iteration of outer loop below avoids string-gaps
      maxCluster = smallestCluster;
    } else {
      maxCluster = 6; //max span = number of strings on guitar
    }

      //sort by cluster size
    for (var clusterSize = smallestCluster; clusterSize <= maxCluster; clusterSize++) {
      //run through all configurations, pushing smallest (most playable) clusters to DOM first
      for (var i = 0; i < allConfigs.length; i++) {
        if((allConfigs[i].stringSpan == clusterSize)) {
          //search whole cluster array and push to elementSet array

          clusterConfigs.push(allConfigs[i]);
        }
      }
    }
    return clusterConfigs;
  }

  function stringFilter(chordSets) {
    for (var i = 0; i < chordSets.length; i++) {
      for (var j = 0; j < chordSets[i].stringFretMidis.length; j++) {
        if(self.allowedStrings[chordSets[i].stringFretMidis[j][0]] == false) {
          console.log("string splice", chordSets[i]);
          chordSets.splice(i,1);
          i--;
          break;
        }
      }
    }
    console.log('allowed strings', self.allowedStrings);
    return chordSets;
  }

  function inversionFilter (chordSets) {
    for (var i = 0; i < chordSets.length; i++) {
      if(self.allowedInversions[chordSets[i].inversion] == false) {
        console.log("inversion splice", chordSets[i]);
        chordSets.splice(i,1);
        i--;
      }
    }
    console.log('allowedinverions', self.allowedInversions);
    return chordSets;
  }

  function sliderFilter(chordSets) {
    lowLimit = parseFloat($('.noUi-origin')[0].style.left);
    console.log('left slider', lowLimit);
    highLimit = parseFloat($('.noUi-origin')[1].style.left);
    console.log('left slider', highLimit);
    for (var i = 0; i < chordSets.length; i++) {
      for (var j = 0; j < chordSets[i].stringFretMidis.length; j++) {
        var fretNum = chordSets[i].stringFretMidis[j][1];
      //  console.log('fretnum, position', fretNum, fretPositions[fretNum]);
        if(lowLimit > fretPositions[fretNum] || highLimit < fretPositions[fretNum]) {

          if(!(self.allowOpen && !fretNum)) {
            //console.log("slider splice", chordSets[i]);
            chordSets.splice(i,1);
            i--;
            break;
          }
        }
      }
    }
    return chordSets;
  }

  function displayTriad() {
    if(filteredConfigs[0] == undefined) {
      //TODO: choose way to back out of error state
      alert('No Chord Configurations Available');
      return 0; //exit function
    }

    //the thisTriad variation dictated by prev/next buttions
    var thisTriad = filteredConfigs[self.triadIndex];
    console.log('This triad:', thisTriad);
    $('.marker').attr('src', "../img/empty.svg");
    $('.marker').each(function() {
      $fret = $(this);
      $fretCoord = $(this).data('stringfretmidi');
      for (var i = 0; i < thisTriad.stringFretMidis.length; i++) {
        if(thisTriad.stringFretMidis[i] == $fretCoord) {
          $fret.attr('src', svgSources[i]);
          break;
        }
      }
    });
  };



  self.nextVar = function() {
    self.triadIndex++;
    if (self.triadIndex > filteredConfigs.length - 1) {
      self.triadIndex = 0;
    }
    displayTriad();
  }

  self.prevVar = function() {
    self.triadIndex--;
    if (self.triadIndex < 0) {
      self.triadIndex = filteredConfigs.length - 1;
    }
    displayTriad();
  }
  var svgSources = [
    //indicies correspond with that of thisTriad, filteredConfigs[];
    "../img/1.svg",
    "../img/3.svg",
    "../img/5.svg",
    "../img/alt.svg",
    "../img/empty.svg"
  ]

  self.chordSpan = {
    spans: [
      {span: 0},
      {span: 1},
      {span: 2},
      {span: 3},
      {span: 4},
      {span: 5}],
    selectedSpan:
      {span: 3}
      };

  noUiSlider.create(sliderBar, {
  	start: [20, 80],
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 100
  	}
  });


  function cloneTwoDimArray(arr) {
    // Deep copy arrays. Going one level deep seems to be enough.
    var clone = [];
    for (i=0; i<arr.length; i++) {
      clone.push( arr[i].slice(0) )
    }
    return clone;
  }

  // function compare(a,b) {
  //   if (a.stringFretMidi[1] < b.stringFretMidi[1])
  //     return -1;
  //   if (a.stringFretMidi[1] > b.stringFretMidi[1])
  //     return 1;
  //   return 0;
  // }
  //fretNotes.sort(compare);

}]);
