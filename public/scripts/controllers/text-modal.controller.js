
app.controller('ModalController', function($scope, songData, newSong, close) {
  const self = this;
  self.songData = songData;
  self.close = close;
  self.newSong = newSong;

  function resizeIt(el) {
    var str = el.value;
    var linecount = str.split(/\n/g).length;
    el.rows = linecount + 1;
  }

  setTimeout(() => resizeIt(document.getElementById('song-text')), 0); //set textarea height after ng vars have loaded

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
    elem = document.getElementById('song-text');
    if (event.keyCode == 27) { //escape
      close();
    } else if (event.keyCode == 192) {
      event.preventDefault();
      insertText(elem, 'bars');
    } else if (event.keyCode == 9) {
      event.preventDefault();
      insertText(elem, 'tab');
    } else {
      resizeIt(elem);
    }
  });

  function insertText(el, type) {
    var cursorPos = el.selectionStart;
    var offset = el.value.substring(0, el.selectionStart).split(/\n/g).length - 1;
    var insertItem = '';
    if (type == 'bars') {
      insertItem = "|-------------|-------------|-------------|";
    } else if (type == 'tab') {
      insertItem = "     ";
    }
    self.songData.song = self.songData.song.insert(cursorPos + offset, insertItem);
    $scope.$apply();
    el.focus();
    el.setSelectionRange(cursorPos + insertItem.length, cursorPos + insertItem.length);
  }

  String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
  };

});
