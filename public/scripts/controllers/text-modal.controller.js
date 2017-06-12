
app.controller('ModalController', function($scope, songData, newSong, close) {
  const self = this;
  self.songData = songData;
  self.close = close;
  self.newSong = newSong;

  console.log('song', songData);

  self.plus = function() {
    self.songData.song = changeChords(self.songData.song);
  };

  self.minus = function() {
    for (var i = 0; i < 11; i++)
       self.plus();
  };

  function changeChords (text) {
    const tonics = ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab'];
    const regEx = /([A-G](\#|b)?(?=((m\s|maj|dim)|(\d\d?)|(add\d)|(sus)|(\s|\n))))/g;
    return text.replace(regEx, (match) =>
      tonics[(tonics.indexOf(match) + 1) % 12]);
  }

  $( "body" ).keydown(function() {
    if (event.keyCode == 27) //escape
      close();
  });

});
