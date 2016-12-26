
//$('.fretboardContainer') change r
// slider position relation to guitar fret#
app.controller('TriadController', ["$http", "$scope", 'Factory', function($http, $scope, Factory) {
  var self = this;
  var fretNotes = [];
  var masterSet = [];
  var possibleConfigs = [];
  var notes = [];
  self.range = [0, 15];
  self.allowOpen = false;
  self.onlyClusters = true;
  self.octaves = true;
  self.maxSpan = 3;
  self.triadIndex = 0;
  self.tonic = 'C';
  self.allowedInversions = [true, true, true, true];
  self.allowedStrings = [true, true, true, true, true, true];
  self.inversionNames = ['Root', 'First', 'Second', 'Third', 'Fourth'];
  self.tonicList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G#', 'A', 'A#', 'B'];

  self.neck = new Guitar();
  self.neck.frets_shown = 15;
  //get chord list from MongoDB
  getChords();


  self.newChord = function() {
    notes = [];
    fretNotes = [];
    //populate array with semitone intervals of chord
    for (var i = 0; i < self.type.notes.length; i++) {
      notes[i] = (note(self.tonic).pos + self.type.notes[i]) % 12;
    }
    self.numNotes = notes.length;
    console.log('notes', notes);
    var i=0;
    $('.marker').each(function() {
      $fretMidiNote = $(this).data('stringfretmidi')[2];
      //if this fret-note is contained in the selected chord, add array of objects describing fret-note location and relation to chord
      var noteRelation = notes.indexOf($fretMidiNote % 12);
      if (noteRelation != -1) {
        fretNotes.unshift({
          string: $(this).data('stringfretmidi')[0],
          fret: $(this).data('stringfretmidi')[1],
          midi: $fretMidiNote,
          relation: noteRelation,
          id: $(this).attr('id')
        });
        i++;
      }
    });
    findTriads();
    self.filter();
  };

  function findTriads() {
    masterSet = [];
    var midis = [];
    var strings = [];
    var frets = [];
    var ids = [];
    var relations = [];
    var index = [];
    var count = 0;

    for (var i = 0; i < fretNotes.length; i++) {
      var stringIsFree = strings.indexOf(fretNotes[i].string) == -1;
      var relativeNoteUnused = relations.indexOf(fretNotes[i].relation) == -1;
      //if the string and note are not already used in the chord being constructed
      if (stringIsFree && relativeNoteUnused) {
        notePush(i);
        //if the temp array contains each of the chord notes, push to master & look for extra notes to add to chord
        if (count == self.numNotes) {
          masterPush();
          i = moreStrings(i + 1);
        }
        //traverse back to lower strings
        //if temp arrays are empty the for loop will conditionally terminate
      }
      while (i > fretNotes.length - 2) {
        i = notePop();
      }
    }
    function moreStrings(idx) {
      var len = count;
      for (var i = idx; i < fretNotes.length; i++) {
        //if the string and note are not already used in the chord being constructed
        var stringIsFree = strings.indexOf(fretNotes[i].string) == -1;
        var isNextString = fretNotes[i].string == strings[0] + strings.length;
        if (stringIsFree && isNextString) {
          notePush(i);
          masterPush();
        }
        while(i > fretNotes.length - 2) {
          if (count == len) { break; }
          i = notePop();
        }
      }
      return notePop();
    }
    //remove the last note added to the last masterSet chord
    function notePop() {
      frets.pop();
      midis.pop();
      ids.pop();
      strings.pop();
      relations.pop();
      count--;
      return index.pop();
    }
    //append arrays containing strings and relations already part of the chord being built
    function notePush(i) {
      strings.push(fretNotes[i].string);
      frets.push(fretNotes[i].fret);
      midis.push(fretNotes[i].midi);
      ids.push(fretNotes[i].id);
      relations.push(fretNotes[i].relation);
      count++;
      index.push(i);
    }
    function masterPush(){
      masterSet.push({
        strings: strings.slice(),
        frets: frets.slice(),
        ids: ids.slice(),
        midis: midis.slice(),
        relations: relations.slice(),
        count: count
      });
    }

  };

  self.filter = function() {
    self.triadIndex = 0;
    possibleConfigs = [];
    console.log('masterset', masterSet);
    for (var i = 0; i < masterSet.length; i++) {
      //if open strings allowed, ignore zerows for fret span calculation
      if (self.allowOpen) {
        var fretSpan = findSpan(masterSet[i].frets, 0);
      } else {
        var fretSpan = findSpan(masterSet[i].frets);
      }

      //populate array of triad formations AND corresponding string-spans if they meet octave and fret-span conditions
      if (octaveSpanString(fretSpan, masterSet[i].strings)) {
        //  console.log('triadmidis', triadMidis, Math.min(...triadMidis));
        masterSet[i].fretSpan = fretSpan;
        masterSet[i].inversion = notes.indexOf(Math.min(...masterSet[i].midis) % 12);
        masterSet[i].strings.sort(compare);
        masterSet[i].frets.sort(compare);
        possibleConfigs.push(masterSet[i]);
      }
    }
    possibleConfigs = clusterSort(possibleConfigs);
    possibleConfigs = inversionSliderFilter(possibleConfigs);
    //DOM binding listing number of chord variations
    self.variations = possibleConfigs.length;
    console.log('updated possibleConfigs:', possibleConfigs);
    displayTriad();
  };

  function octaveSpanString(fretSpan, usedStrings) {
    var len = usedStrings.length
    var spanBool = fretSpan <= self.maxSpan;
    var octaveBool = self.octaves || (len <= self.numNotes);
    var stringActive = true;
    for (var i = 0; i < len; i++) {
      if (self.allowedStrings[usedStrings[i]] == false) {
        stringActive = false;
        break;
      }
    }
    return spanBool && octaveBool && stringActive;
  }

  function clusterSort(allConfigs) {
    var clusterConfigs = [];
    if (self.onlyClusters) {
      clusters(0);
    } else {
      for (var i = 0; i < 3; i++) {
        clusters(i);
      }
    }
    function clusters(skips) {
      //get all clusters of a given string span
      for (var i = 0; i < allConfigs.length; i++) {
        if (findSpan(allConfigs[i].strings) == allConfigs[i].count - 1 + skips) {
          clusterConfigs.push(allConfigs[i]);
        }
      }
    }
    return clusterConfigs;
  }

  function inversionSliderFilter(chordSets) {
    for (var i = 0; i < chordSets.length; i++) {
      var inversionNotAllowed = !self.allowedInversions[chordSets[i].inversion];
      if (inversionNotAllowed || outOfSliderRange(chordSets[i])) {
        // remove this chordset if this inversion is not allowed
        chordSets.splice(i--,1);
      }
    }
    return chordSets;

    function outOfSliderRange(chordSet) {
      for (var i = 0; i < chordSet.count; i++) {
        var fretNum = chordSet.frets[i];
        var outOfRange = self.range[0] > fretNum || self.range[1] < fretNum;
        //check with open-string condition
        if (outOfRange && (!self.allowOpen || fretNum)) { return true;}
      }
    }
  }

  function displayTriad() {
    if (!self.variations) {return 0;} //abort if no matches
    //the thisTriad variation dictated by prev/next buttions
    var thisTriad = possibleConfigs[self.triadIndex];
    console.log('This triad:', thisTriad);
    //reset all markers to empty
    $('.marker').attr('src', "../img/empty.svg");
    for (var i = 0; i < thisTriad.count; i++) {
      var intvl = self.intervalName(notes.indexOf(thisTriad.midis[i] % 12));
      $('#' + thisTriad.ids[i]).attr('src', "../img/" + intvl + ".svg");
    }
  }

  function convertList(chordsArray) {
    self.types = [];
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
    self.newChord();
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
    if (self.triadIndex > possibleConfigs.length - 1) {
      self.triadIndex = 0;
    }
    displayTriad();
  }

  self.prevVar = function() {
    self.triadIndex--;
    if (self.triadIndex < 0) {
      self.triadIndex = possibleConfigs.length - 1;
    }
    displayTriad();
  }

  self.noteName = function(pos) {
    //relative cof positions to determine if # or flat
    return MUSIQ.sharpNames[notes[pos]];
  }

  self.intervalName = function(pos) {
    var thisNote = Note.fromNotation(self.noteName(pos));
    var root = Note.fromNotation(self.tonic);
    var intervalName = Interval.fromNotes(root, thisNote).name();
    if (intervalName == 'unison') {
      intervalName = 'tonic';
    } else if (intervalName == 'tritone') {
      intervalName = "flat fifth";
    }
    return intervalName;
  }

/************************************SLIDER***********************************/
  var nonLinearSlider = document.getElementById('nonlinear');

  noUiSlider.create(nonLinearSlider, {
    connect: true,
    behaviour: 'tap',
    start: [ 0, 15 ],
    range: {
      'min': [ 0, 1 ],
      '10%': [1, 1],
      '19.5%': [2, 1],
      '28.5%': [3, 1],
      '36%': [4, 1],
      '43.8%': [5, 1],
      '51%': [6, 1],
      '58%': [7, 1],
      '64%': [8, 1],
      '70.5%': [9, 1],
      '76%': [10, 1],
      '81.5%': [11, 1],
      '87%': [12, 1],
      '92%': [13, 1],
      '96.5%': [14, 1],
      'max': [ 15, 1 ]
    }
  });

  nonLinearSlider.noUiSlider.on('change', function (values, handle, unencoded, isTap, positions) {
    //set fret limits
    self.range[0] = parseInt(values[0]);
    self.range[1] = parseInt(values[1]);
    self.filter();
    //update ng-DOM
    $scope.$apply();
  });

/******************************UTILITY FUNCTIONS******************************/
  function removeElem(arr, elem) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === elem) {
            arr.splice(i, 1);
        }
    }
    return arr;
  }

  function findSpan(ary, ignore) {
    if (ignore !== undefined) {
      ary = removeElem(clone(ary), ignore);
    }
    return Math.max(...ary) - Math.min(...ary);
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

  function compare(a,b) {
    if (a < b)
    return -1;
    if (a > b)
    return 1;
    return 0;
  }

  if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
    return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
    return false;

    for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
        return false;
      }
      else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, "equals", {enumerable: false});
}]);
