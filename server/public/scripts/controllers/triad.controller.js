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
  var allVars = [];
  var splitVars = [];

  var nonLinearSlider = document.getElementById('nonlinear');



  self.newChord = function() {
    self.guitar = new Guitar();
    var thisChord = chord(self.chord + self.type.name);
    allVars = GuitarChord.fromChord(self.guitar, thisChord);

    console.log(allVars);

    notes = [];
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
    self.filter();
  };

  function parseConfigs(){
    self.variations = 0;
    for (var i = 0; i < allVars.length; i++) {
      for (var j = 0; j < allVars[i].length; j++) {
        var len = allVars[i][j].length;
        self.variations += len * allVars[i].len;

        // while(len > 1) {
        //   tmp = clone(allVars[i]);
        //   allVars.splice(tmp, i);
        //   allVars[i][j].slice(len - 1);
        //   allVars[i+1][j].slice(len - 2);
        //   len = allVars[i][j].length;
        // }
      }
    }
  }

  function getCombos(stringSet) {
    var flag = false;
    var triadFrets = [];
    var triadStrings = [];
    var triadMidis = [];
    var triadStringFretMidis = [];
    for (var j = 0; j < stringSet.length; j++) {
      for (var k = 0; k < stringSet[j].length; k++) {
        if(used.indexOf('s' + j + k) == -1) {
          used.push('s' + j + k);
          triadStringFretMidis.push([stringSet[j][k].pos[0], stringSet[j][k].pos[1], stringSet[j][k].note.pos]);
          triadStrings.push(stringSet[j][k].pos[0]);
          triadMidis.push(stringSet[j][k].note.pos);
        }
      }
    }
    possibleConfigs.push({
      stringFretMidis: triadStringFretMidis,
      strings: triadStrings,
      stringSpan: findSpan(triadStrings),
      frets: triadFrets.sort(compare),
      inversion: triadMidis.indexOf(Math.min(...triadMidis))
    });
  }

  self.filter = function() {
    var possibleConfigs = [];
    var used = [];
    for (var i = 0; i < allVars.length; i++) {
      getCombos(allVars[i]);
    }
    console.log('possible configs:', possibleConfigs);
    filteredConfigs = clone(possibleConfigs);

    self.variations = filteredConfigs.length;
    self.triadIndex = 0;
    displayTriad();
  };

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

  function displayTriad() {
    console.log('variations', self.variations);
    if(!self.variations) {return 0;} //abort if no matches
    //the thisTriad variation dictated by prev/next buttions
    var thisTriad = filteredConfigs[self.triadIndex];
    console.log('This triad:', thisTriad);
    $('.marker').attr('src', "../img/empty.svg");
    $('.marker').each(function() {
      $fret = $(this);
      $fretCoord = $(this).data('stringfretmidi');
      for (var i = 0; i < thisTriad.stringFretMidis.length; i++) {
        if(thisTriad.stringFretMidis[i].equals($fretCoord)) {
          var intvl = MUSIQ.intervalNames[Math.abs(($fretCoord[2] % 12) - notes[0])];
          console.log('intve', intvl);
          $fret.attr('src', "../img/" + intvl + ".svg");
          break;
        }
      }
    });
  };


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

  getChords();

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

/******************************UTILITY FUNCTIONS******************************/
    function cloneTwoDimArray(arr) {
      // Deep copy arrays. Going one level deep seems to be enough.
      var clone = [];
      for (i=0; i<arr.length; i++) {
        clone.push( arr[i].slice(0) )
      }
      return clone;
    }

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

    function compare(a,b) {
      if (a < b)
      return -1;
      if (a > b)
      return 1;
      return 0;
    }

    self.noteName = function(pos) {
      return MUSIQ.sharpNames[notes[pos]];
    }

    function findSpan(ary) {
      return Math.max(...ary) - Math.min(...ary);
    }

    if(Array.prototype.equals)
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
