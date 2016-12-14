app.controller('CagedController', ["$http", function($http) {
  var self = this;
  self.cagedChord = {};
  self.chosenScale = '';
  self.scaleTypes = [
    'CAGED Major Chord',
    'Dorian (Major)',
    'Pentatonic',
  ];
  self.scale = self.scaleTypes[0];

self.changeScaleType = function(index) {
  console.log('change self.scaletype', self.scale);
};

  self.newChord = function() {
    console.log('self.scaletype', self.scale);

    console.log('cagedChord:', self.cagedChord);

    self.selected = note(self.cagedChord);
    scale = MUSIQ.notePositions;
    console.log('scale', scale);
    console.log('selectedChord', self.selected);
    $('.marker').attr('src', "../img/empty.svg");

    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      //set notes to array of notes contained in selected chord
      for (var i = 0; i < scale.length; i++) {
        var thisNote = (scale[i] + self.selected.pos) % 12;

        if (thisNote == $fretMidiNote % 12) {
          console.log('note found');
          $fret.attr('src', "../img/" + (i + 1) + ".svg");
        }
      }
    });
  };

  var svgSources = [
    //indicies correspond with that of thisTriad, filteredConfigs[];
    "../img/root.svg",
    "../img/second.svg",
    "../img/third.svg",
    "../img/fourth.svg",
    "../img/fifth.svg",
    "../img/sixth.svg",
    "../img/seventh.svg",
    "../img/empty.svg"
  ]
}]);
