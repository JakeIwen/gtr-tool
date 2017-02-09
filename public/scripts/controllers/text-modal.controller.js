
app.controller('ModalController', function($scope, song, title, close) {
  const self = this;
  self.song = song;
  self.title = title;
  console.log('song', title);
  self.close = close;



  self.plus = function() {
    self.song = changeChords(self.song);
  }

  self.minus = function() {
    for (var i = 0; i < 11; i++) {
       self.song = changeChords(self.song);
     }
  }

  self.saveSong = function() {

  }

  function changeChords (text) {
    console.log('chgchord');
    const tonics = ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab'];
    const regEx = /([A-G](\#|b)?(?=(m|maj|dim)|(\d\d?)|(add)|(sus)|(\s|\n)))/g;
    return text.replace(regEx, (match) =>
      tonics[(tonics.indexOf(match) + 1) % 12]);
  }




});
