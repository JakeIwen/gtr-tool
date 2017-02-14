app.controller('TextController', ["$firebaseAuth", "$http", "$scope", "ModalService", function( $firebaseAuth, $http, $scope, ModalService ) {
  const self = this;
  var auth = $firebaseAuth();
  var currentUser = {};

  function addToDb(title, song, privateBool) {
    if (title && song) {
      var songData = {
        title: title,
        song: song,
        date_added: new Date(),
        private: privateBool
      }
      currentUser.getToken().then(function(idToken) {
        console.log('getting song list');
        $http({
          method: 'POST',
          url: '/songs/',
          data: songData,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log('song added to DB');
          songData.date_added = moment(songData.date_added).fromNow();
          self.songList.push(songData);
        }).catch(function(err) {
          console.log("Error in song creation");
        });
      });
    } else {
      alert('invalid song title or data');
    }
  }
  self.getSong = function(songId) {
    console.log('get songid', songId);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/songs/title/' + songId,
        headers: { id_token: idToken }
      }).then(function(response) {
        console.log('reponee ', response.data);
        self.showModal(response.data);
        self.songText = response.data.song;
        self.title = response.data.title;
      }).catch(function(err) {
        console.log("Error getting songs:", err);
      });
    });
  }

  self.updateSong = function(songData) {
    console.log(' update songid', songData);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'PUT',
        url: '/songs/title/' + songData._id,
        data: songData,
        headers: { id_token: idToken }
      }).then(function(response) {
        console.log('reponese ', response);
      }).catch(function(err) {
        console.log("Error getting songs:", err);
      });
    });
  }

  self.showModal = function(songData) {
    console.log('showing modal', songData);
    ModalService.showModal({
      templateUrl: "/views/templates/text-modal.html",
      controller: "ModalController",
      controllerAs: 'modal',
      scope: $scope,
      inputs: {
        songData: songData,
      }
      // resolve: {
      //   items: function () {
      //     return $scope.items;
      //   },
      //   size: function() {
      //     console.log('size: ', size);
      //     return size;
      //   }
    }).then(function(modal) {
      modal.close.then(function(result) {
        console.log('closed');
      });
    });
  }

  self.deleteSong = function(songId) {
    console.log('delete songid', songId);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'DELETE',
        url: '/songs/title/' + songId,
        headers: { id_token: idToken }
      }).then(function(response) {
        console.log('song deleted');
        getSongs();
      });
    });
  }


  self.logIn = function() {
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };
  self.logOut = function() {
    auth.$signOut().then(function() {
      console.log('Logging the user out!');
    });
  }

  auth.$onAuthStateChanged(function(firebaseUser) {
    console.log('authentication state changed');
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      currentUser = firebaseUser;
      // This is where we make our call to our server
      currentUser.getToken().then(function(idToken) {
        $http({
          method: 'POST',
          url: '/users',
          data: self.newUser,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log('response:', response);
        }).catch(function(err) {
          console.log("Error in user creation");
      })
    });
      getSongs();
    } else {
      console.log('Not logged in or not authorized.');
      self.songList = [];
      currentUser = {};
    }
  });

  function getSongs() {
    currentUser.getToken().then(function(idToken) {
      console.log('getting song list');
      $http({
        method: 'GET',
        url: '/songs/public',
        headers: {
          id_token: idToken
        }
      }).then(function(response) {
        self.songList = response.data;
        for (var i = 0; i < self.songList.length; i++) {
          self.songList[i].date_added = moment(self.songList[i].date_added).fromNow();
        }
        console.log('self.songList', self.songList);
      });
    });

  }
  self.submit = function(textFiles, privateBool) {
    for (var i = 0; i < textFiles.length; i++) {
      addToDb(textFiles[i].name, textFiles[i].file, privateBool);
    }
    console.log('submitting');
  }
  /***************************ANGULAR SEARCH FILTER ***************************/
  self.currentPage = 0;
  self.pageSize = 12
  self.filtered = [];
  self.loading = false;
  self.sortType = 'id';
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
      console.log('changed startPage');
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
