
app.controller('ModalController', function($scope, songData, close) {
  const self = this;
  self.songData = songData;
  console.log('song', songData);
  self.close = close;
  if (self.songData == 'new') {
    console.log('new');
    self.edit = true;
    self.update = false;
  }

  self.plus = function() {
    self.songData.song = changeChords(self.songData.song);
    console.log('songdata', self.songData);
  };

  self.minus = function() {
    for (var i = 0; i < 11; i++) {
       self.songData.song = changeChords(self.songData.song);
     }
  };

  function changeChords (text) {
    const tonics = ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab'];
    const regEx = /([A-G](\#|b)?(?=((m\s|maj|dim)|(\d\d?)|(add\d)|(sus)|(\s|\n))))/g;
    return text.replace(regEx, (match) =>
      tonics[(tonics.indexOf(match) + 1) % 12]);
  }

  $( "body" ).keydown(function() {
    if (event.keyCode == 27)
      close();
  });



});
