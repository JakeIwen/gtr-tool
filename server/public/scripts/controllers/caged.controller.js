app.controller('CagedController', ["$http", function($http) {
  var self = this;
  self.cagedChord = {};

  self.newChord = function() {
    console.log('cagedChord:', self.cagedChord);

    self.selectedChord = chord(self.cagedChord);
    console.log('selectedChord', self.selectedChord);
    $('.marker').each(function() {
      $fret = $(this);
      $fretMidiNote = $(this).data('midi');
      //set notes to array of notes contained in selected chord
      var notes = self.selectedChord.notes;

      switch($fretMidiNote % 12) {
        case notes[0]:
          $fret.attr('src', "../img/root.svg");
          break;
        case notes[1]:
          $fret.attr('src', "../img/third.svg");
          break;
        case notes[2]:
          $fret.attr('src', "../img/fifth.svg");
          break;
        default:
          $fret.attr('src', "../img/empty.svg");
      }

    });
  };

}]);
