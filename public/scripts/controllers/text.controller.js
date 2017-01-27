app.controller('TextController', ["$firebaseAuth", "$http", "$scope", function( $firebaseAuth, $http, $scope) {
  var self = this;
  var auth = $firebaseAuth();
  var currentUser = {};
  self.obj = {};

  self.addToDb = function(title, song) {
    if (title && song) {
      var songData = {
        title: title,
        song: song
      }
      currentUser.getToken().then(function(idToken){
        console.log('getting song list');
        $http({
          method: 'POST',
          url: '/songs/',
          data: songData,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log('song added to DB');
          getSongs();
        });
      });
    } else {
      alert('invalid song title or data');
    }
  }
  self.getSong = function(songId){
    console.log('songid', songId);
    currentUser.getToken().then(function(idToken){
      console.log('getting song list');
      $http({
        method: 'GET',
        url: '/songs/title/' + songId,
        headers: { id_token: idToken }
      }).then(function(response){
        console.log('reponee ', response.data);
        self.songText = response.data.song;
        self.title = response.data.title;
      });
    });
  }
  self.deleteSong = function(songId){
    console.log('delete songid', songId);
    currentUser.getToken().then(function(idToken){
      $http({
        method: 'DELETE',
        url: '/songs/title/' + songId,
        headers: { id_token: idToken }
      }).then(function(response){
        console.log('song deleted');
        getSongs();
      });
    });
  }


  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  }

  auth.$onAuthStateChanged(function(firebaseUser){
    console.log('authentication state changed');
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      currentUser = firebaseUser;
      // This is where we make our call to our server
      currentUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/users',
          data: self.newUser,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log('response:', response);
        });
      });
      getSongs();
    } else {
      console.log('Not logged in or not authorized.');
      self.songList = [];
      currentUser = {};
    }
  });

  function getSongs(){
    currentUser.getToken().then(function(idToken){
      console.log('getting song list');
      $http({
        method: 'GET',
        url: '/songs/titles',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        self.songList = response.data;
        console.log('self.songList', self.songList);
      });
    });

  }
  self.submit = function(){
    for (var i = 0; i < self.obj.length; i++) {
      self.addToDb(self.obj[i].name, self.obj[i].file);
    }
    console.log('submitting');
  }

  self.plus = function() {
    changeChords();
  }
  self.minus = function() {
    for (var i = 0; i < 11; i++) {
       changeChords();
     }
  }



  function changeChords () {
    var chordDoc = $('#source').val()
      // notes = ['Bb', 'A#'];
      //
      // for(note in notes) {
      //   .replace(/note[0]/g, note[1])
      //   };

      .replace(/Bb/g, 'A#')
      .replace(/Db/g, 'C#')
      .replace(/Eb/g, 'D#')
      .replace(/Gb/g, 'F#')

      .replace(/G# /g, 'K@ ')
      .replace(/G /g, 'G# @')
      .replace(/F# /g, 'G@ ')
      .replace(/F /g, 'F# @')
      .replace(/E /g, 'F@ ')
      .replace(/D# /g, 'E@ ')
      .replace(/D /g, 'D# @')
      .replace(/C# /g, 'D@ ')
      .replace(/C /g, 'C# @')
      .replace(/B /g, 'C@ ')
      .replace(/A# /g, 'B@ ')
      .replace(/A /g, 'A# @')
      .replace(/G#m/g, 'Km@ ')
      .replace(/Gm /g, 'G#m@')
      .replace(/F#m/g, 'Gm@ ')
      .replace(/Fm /g, 'F#m@')
      .replace(/Em /g, 'Fm@ ')
      .replace(/D#m/g, 'Em@ ')
      .replace(/Dm /g, 'D#m@')
      .replace(/C#m/g, 'Dm@ ')
      .replace(/Cm /g, 'C#m@')
      .replace(/Bm /g, 'Cm@ ')
      .replace(/A#m/g, 'Bm@ ')
      .replace(/Am /g, 'A#m@')


      .replace(/G# \n/g, 'K\n@')
      .replace(/G\n/g, 'G# \n@')
      .replace(/F# \n/g, 'G\n@')
      .replace(/F\n/g, 'F# \n@')
      .replace(/E\n/g, 'F\n@')
      .replace(/D# \n/g, 'E\n@')
      .replace(/D\n/g, 'D# \n@')
      .replace(/C# \n/g, 'D\n@')
      .replace(/C\n/g, 'C# \n@')
      .replace(/B\n/g, 'C\n@')
      .replace(/A# \n/g, 'B\n@')
      .replace(/A\n/g, 'A# \n@')
      .replace(/G#m\n/g, 'Km\n@')
      .replace(/Gm\n/g, 'G#m\n@')
      .replace(/F#m\n/g, 'Gm\n@')
      .replace(/Fm\n/g, 'F#m\n@')
      .replace(/Em\n/g, 'Fm\n@')
      .replace(/D#m\n/g, 'Em\n@')
      .replace(/Dm\n/g, 'D#m\n@')
      .replace(/C#m\n/g, 'Dm\n@')
      .replace(/Cm\n/g, 'C#m\n@')
      .replace(/Bm\n/g, 'Cm\n@')
      .replace(/A#m\n/g, 'Bm\n@')
      .replace(/Am\n/g, 'A#m\n@')

      .replace(/G#\t/g, 'K\t@')
      .replace(/G\t/g, 'G#\t@')
      .replace(/F#\t/g, 'G\t@')
      .replace(/F\t/g, 'F#\t@')
      .replace(/E\t/g, 'F\t@')
      .replace(/D#\t/g, 'E\t@')
      .replace(/D\t/g, 'D#\t@')
      .replace(/C#\t/g, 'D\t@')
      .replace(/C\t/g, 'C#\t@')
      .replace(/B\t/g, 'C\t@')
      .replace(/A#\t/g, 'B\t@')
      .replace(/A\t/g, 'A#\t@')
      .replace(/G#m\t/g, 'Km\t@')
      .replace(/Gm\t/g, 'G#m\t@')
      .replace(/F#m\t/g, 'Gm\t@')
      .replace(/Fm\t/g, 'F#m\t@')
      .replace(/Em\t/g, 'Fm\t@')
      .replace(/D#m\t/g, 'Em\t@')
      .replace(/Dm\t/g, 'D#m\t@')
      .replace(/C#m\t/g, 'Dm\t@')
      .replace(/Cm\t/g, 'C#m\t@')
      .replace(/Bm\t/g, 'Cm\t@')
      .replace(/A#m\t/g, 'Bm\t@')
      .replace(/Am\t/g, 'A#m\t@')

      .replace(/@/g, '')

      .replace(/K\t/g, 'A\t')
      .replace(/Km\t/g, 'Am\t')
      .replace(/K\n/g, 'A\n')
      .replace(/Km\n/g, 'Am\n')
      .replace(/K /g, 'A ')
      .replace(/Km /g, 'Am ');

    $('#source').val(chordDoc);
  }

  /***************************ANGULAR SEARCH FILTER ***************************/
  self.currentPage = 0;
  self.pageSize = 212
  self.filtered = [];
  self.loading = false;
  self.sortType = 'id'; // set the default sort type
  self.sortReverse = true;  // set the default sort order
  // self.show = {
  //   options: ['Pending', 'Dispatched', 'Completed', 'Declined'],
  //   statuses: [true, true, true, true],
  //   text: function () {
  //     var ret = [];
  //     var pendBool = (!this.statuses[0] && this.options[0]);
  //     var dispBool = (!this.statuses[1] && this.options[1]);
  //     var compBool = (!this.statuses[2] && this.options[2]);
  //     var decBool = (!this.statuses[3] && this.options[3]);
  //     if (compBool) { ret.push(compBool) }
  //     if (decBool) { ret.push(decBool) }
  //     if (dispBool) { ret.push(dispBool) }
  //     if (pendBool) { ret.push(pendBool) }
  //     return ret;
  //   }
  // }
  self.pageCheck = function(numResults) {
    var total = self.totalPages(numResults);
    if (self.currentPage >= total || ((self.currentPage == -1) && total)) {
      self.currentPage = total -1 ;
    }
  }
  self.totalPages = function (num) {
    var total = 0;
    if (num) {
      total = parseInt(((num - 1) / self.pageSize) + 1);
    }
    return total;
  }
}]);
