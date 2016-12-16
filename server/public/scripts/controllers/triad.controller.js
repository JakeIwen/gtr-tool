//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", "$scope", 'Factory', function($http, $scope, Factory) {
  console.log('Triad controller running');
  var self = this;
  var fretNotes = [];
  var masterSet = [];
  var filteredConfigs = [];
  var notes = [];
  var noOctaves = [];
  var fretPositions = [0, 11, 20.5, 29, 37, 44.5, 52, 58.5, 64, 71, 77, 82, 87.5, 92, 96.5, 100];
  self.lowLimit = 0;
  self.highLimit = 15;

  self.allowOpen = false;
  self.onlyClusters = true;
  self.octaves = true;
  self.numNotes = 0;
  self.triadIndex = 0;
  self.allowedInversions = [true, true, true, true];
  self.allowedStrings = [true, true, true, true, true, true];
  self.chord = 'C';
  self.types = [];

  var nonLinearSlider = document.getElementById('nonlinear');



  self.newChord = function() {
    //self.getFrets();
    notes = [];
    console.log('Chord:', self.chord + self.type.names[0]);
    for (var i = 0; i < self.type.notes.length; i++) {
      notes[i] = (note(self.chord).pos + self.type.notes[i]) % 12;
    }
    self.numNotes = notes.length;
    console.log('notes', notes);
    var i=0;
    $('.marker').each(function() {
      $fretMidiNote = $(this).data('stringfretmidi')[2];
      //ensure that this fret-note is contained in the selected chord, then add to array of objects describing fret-note location and relation to chord
      if (notes.indexOf(($fretMidiNote % 12)) != -1) {
        fretNotes[i] = {
          stringFretMidi: $(this).data('stringfretmidi'),
          relation: notes.indexOf(($fretMidiNote % 12)),
        }
        i++;
      }
    });
    findTriads();
    self.filter();
  };

  function findTriads() {
    masterSet = [];
    console.log('frind triads; fretNotes', fretNotes);


    function notePop() {
      strings.pop();
      tmp.pop();
      noteset.pop();
      return index.pop();
    }
    //append arrays containing strings and noteset already part of the chord being built
    function notePush(i) {
      strings.push(fretNotes[i].stringFretMidi[0]);
      tmp.push(fretNotes[i].stringFretMidi);
      index.push(i);
      noteset.push(fretNotes[i].relation);
    }


    var noteIdx = 0;
    var tmp = [];
    var index = [];
    var strings = [];
    var noteset = [];
    var tmpSets = [];


    for (var i = 0; i < fretNotes.length; i++) {
      //if the string and note are not already used in the chord being constructed
      if(strings.indexOf(fretNotes[i].stringFretMidi[0]) == -1 && noteset.indexOf(fretNotes[i].relation) == -1){
        notePush(i);
      }
      //if the temp array contains the correct number of noteset, push to master
      if(tmp.length == self.numNotes){
        var tmpNotes = [];
        for (var k = 0; k < strings.length; k++) {
          if(notes.indexOf(tmp[k][2] % 12) == tmpNotes.length) {
            tmpNotes.push(tmp[k]);
            k = -1;
          }
        }
        masterSet.push(tmpNotes.slice());
        tmp.slice();
        i = notePop();
      }
      //traverse back to lower strings
      //if temp arrays are empty the for loop will conditionally terminate
      while(i > fretNotes.length -2) {
        i = notePop();
      }
    }

      //release a note/ string making it available for another

    console.log(tmpSets, masterSet);
    var len = masterSet.length;
    // for (var stringsUsed = self.numNotes + 1; stringsUsed < 6; stringsUsed++) {
      // for (var orig = 0; orig < len; orig++) {
      //   tmp  = clone(tmpSets[orig][3]);
      //   strings = clone(tmpSets[orig][0]);
      //   notes = clone(tmpSets[orig][1]);
      //   console.log('notes', notes);
      //   index = clone(tmpSets[orig][2]);
      //
      //   for (var i = index[index.length - 1] + 1; i < fretNotes.length; i++) {
      //     if(strings.indexOf(fretNotes[i].stringFretMidi[0]) == -1 && tmp.indexOf(fretNotes[i].stringFretMidi) == -1){
      //       notePush(i);
      //     }
      //     //if the temp array contains the correct number of notes, push to master
      //     if(tmp.length == (self.numNotes + 1)){
      //       masterSet.push(tmp.slice());
      //       i = notePop();
      //     }
      //     //traverse back to lower strings
      //     //if temp arrays are empty the for loop will conditionally terminate
      //     while(i > fretNotes.length - 2) {
      //       if(tmp.length == self.numNotes) {
      //         break;
      //       }
      //       i=notePop();
      //     }
      //
      //
      //   }
      // }
      //



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
        triadStringFretMidis.push(masterSet[i][j]);
        //dont include open strings if user has selected allowOpen
        if(!(self.allowOpen && (masterSet[i][j][1] == 0))) {
          triadFrets.push(masterSet[i][j][1]);
        }
      }
      var triadFretSpan = Math.max(...triadFrets) - Math.min(...triadFrets);
      //console.log('triadFretSpan', triadFretSpan);
      //populate array of triad formations AND corresponding string-spans
      if(triadFretSpan <= stretch) {
      //  console.log('triadmidis', triadMidis, Math.min(...triadMidis));
        possibleConfigs.push({
          stringFretMidis:  triadStringFretMidis,
          //will not include open strings if self.allowOpen checkbox == true (see above)
          fretSpan: triadFretSpan,
          //the span of played strings (smaller is more desireable because there are no open strings to mute in between the strings to be played)
          stringSpan: Math.max(...triadStrings) - Math.min(...triadStrings),
          strings: triadStrings,
          frets: triadFrets,
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
    console.log('updated. filteredConfigs:', filteredConfigs);
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
        // console.log("inversion splice", chordSets[i]);
        chordSets.splice(i,1);
        i--;
      }
    }
    console.log('allowedinverions', self.allowedInversions);
    return chordSets;
  }

  function sliderFilter(chordSets) {
    console.log('left slider', self.lowLimit);
    console.log('right slider', self.highLimit);
    for (var i = 0; i < chordSets.length; i++) {
      for (var j = 0; j < chordSets[i].stringFretMidis.length; j++) {
        var fretNum = chordSets[i].stringFretMidis[j][1];
        if(self.lowLimit > fretNum || self.highLimit < fretNum) {
          if(!(self.allowOpen && !fretNum)) {
            chordSets.splice(i,1);
            i--;
            break;
          }
        }
      }
    }
    return chordSets;
  }
  //
  // function octaveFilter() {
  //   for (var i = 0; i < filteredConfigs.length; i++) {
  //     var strings = filteredConfigs[i].strings;
  //     var frets = filteredConfigs[i].frets;
  //     var newNote = filteredConfigs[i].stringFretMidi[2] % 12;
  //
  //     for (var j = 0; j < fretNotes.length; j++) {
  //       var newString = fretNotes[j].stringFretMidi[0] % 12;
  //       var newFret = fretNotes[j].stringFretMidi[1] % 12;
  //
  //       var thisNote = filteredConfigs[i].stringFretMidi[2] % 12;
  //       if (newNote == thisNote && strings.indexOf(newString) == -1) {
  //         strings.push(newString);
  //         frets.push(newFret);
  //         if(findSpan(frets) <= self.chordSpan) {
  //           var tmp =
  //
  //             stringFretMidis:  triadStringFretMidis,
  //             //will not include open strings if self.allowOpen checkbox == true (see above)
  //             fretSpan: triadFretSpan,
  //             //the span of played strings (smaller is more desireable because there are no open strings to mute in between the strings to be played)
  //             stringSpan: Math.max(...triadStrings) - Math.min(...triadStrings),
  //             strings: triadStrings,
  //             inversion: triadMidis.indexOf(Math.min(...triadMidis)),
  //           }
  //
  //             filteredConfigs.splice(i, 0, thisNote);
  //
  //
  //       }
  //     }
  //   }
  //   displayTriad();
  // }

  function displayTriad() {

    if(!self.variations) {
      return 0; //exit function if no matches
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
          var intvl = MUSIQ.intervalNames[Math.abs(($fretCoord[2] % 12) - notes[0])];
          console.log('intve', intvl);
          $fret.attr('src', "../img/" + intvl + ".svg");
          break;
        }
      }
    });
  };

  self.noteName = function(pos) {
    return MUSIQ.sharpNames[notes[pos]];
  }

  self.toggleInversion = function(index) {
    self.allowedInversions[index] = !(self.allowedInversions[index]);
    self.filter();
  };

  self.toggleString = function(string) {
    self.allowedStrings[string] = !(self.allowedStrings[string]);
    self.filter();
  }

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

    noUiSlider.create(nonLinearSlider, {
      connect: true,
      behaviour: 'tap',
      start: [ 0, 15 ],
      range: {
        // Starting at 500, step the value by 500,
        // until 4000 is reached. From there, step by 1000.
        'min': [ 0, 1 ],
        '10%': [1, 1],
        '19%': [2, 1],
        '28%': [3, 1],
        '36%': [4, 1],
        '43.8%': [5, 1],
        '51%': [6, 1],
        '58%': [7, 1],
        '64%': [8, 1],
        '71.5%': [9, 1],
        '77%': [10, 1],
        '82%': [11, 1],
        '87%': [12, 1],
        '92.5%': [13, 1],
        '97%': [14, 1],
        'max': [ 15, 1 ]
      }
    });

    nonLinearSlider.noUiSlider.on('change', function ( values, handle, unencoded, isTap, positions ) {
      //set fret limits
      self.lowLimit = parseInt(values[0]);
      self.highLimit = parseInt(values[1]);
      self.filter();
      //update ng-DOM
      $scope.$apply();
      console.log('sliderchange');
    });

    function convertList(chordsArray) {
      //turn mongoDb data into array of chord objects
      for (var i = 0; i < chordsArray.length; i++) {
        var obj = {
          name: chordsArray[i].longName,
          names: chordsArray[i].names,
          notes: chordsArray[i].notes
        };
        self.types.push(obj);
      }  //set default chord
      self.type = self.types[0];
      console.log('self.types', self.types);
      self.newChord();
      // if (self.type) {
      //   setTimeout( function() {
      //     self.newChord();
      //     $scope.$apply();
      //   }, 1);
      // }
    }

    function getChords() {
      //ajax call to get scales from MongoDb
      $http.get('/chords/')
      .then(function(response) {
        console.log('getnames response', response.data);
        convertList(response.data);;
      },
      function(response) {
        console.log('get error:', response);
      });
    }


    function cloneTwoDimArray(arr) {
      // Deep copy arrays. Going one level deep seems to be enough.
      var clone = [];
      for (i=0; i<arr.length; i++) {
        clone.push( arr[i].slice(0) )
      }
      return clone;
    }

    getChords();



    function findSpan(ary) {
      return Math.max(ary) - Math.min(ary);
    }

  function clone (existingArray) {
   var newObj = (existingArray instanceof Array) ? [] : {};
   for (i in existingArray) {
      if (i == 'clone') continue;
      if (existingArray[i] && typeof existingArray[i] == "object") {
         newObj[i] = clone(existingArray[i]);
      } else {
         newObj[i] = existingArray[i]
      }
   }
   return newObj;
}
  //  $(document).ready(function() {
      //replace with custom directive
      //http://stackoverflow.com/questions/13471129/ng-repeat-finish-event
      // console.log($('img[data-stringfretmidi="[0, 15, 55]]"'));
  // console.log($('img[data-stringfretmidi="[0, 15, 55]]"'));

  //  });

  // function compare(a,b) {
  //   if (a.stringFretMidi[1] < b.stringFretMidi[1])
  //     return -1;
  //   if (a.stringFretMidi[1] > b.stringFretMidi[1])
  //     return 1;
  //   return 0;
  // }
    //fretNotes.sort(compare);


  }]);
