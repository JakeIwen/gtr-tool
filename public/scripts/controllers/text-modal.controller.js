
app.controller('ModalController', function($scope, song, title, close) {
  const self = this;
  self.song = song;
  self.title = title;
  console.log('song', title);
  self.close = close;

});
