app.controller('GuitarController', ["$http", function($http) {

  console.log('guitarNeck controller running');
  var self = this;
  self.neck = new Guitar();
  self.neck.frets_shown = 15;
  console.log('this guitar:', self.neck);


}]);
