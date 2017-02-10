
app.controller('ModalController', function($scope, songData, close) {
  const self = this;
  self.songData = songData;
  self.title = songData.title;
  console.log('song', songData);
  self.close = close;
  if (self.songData == {}) {
    self.edit = true;
    self.update = false;
  }



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
    const tonics = ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab'];
    const regEx = /([A-G](\#|b)?(?=((m|maj|dim)|(\d\d?)|(add\d)|(sus)|(\s|\n))))/g;
    return text.replace(regEx, (match) =>
      tonics[(tonics.indexOf(match) + 1) % 12]);
  }




});
