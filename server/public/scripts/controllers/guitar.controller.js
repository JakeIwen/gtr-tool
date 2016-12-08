app.controller('GuitarController', ["$http", function($http) {

  console.log('guitarNeck controller running');
  var self = this;
  self.neck = new Guitar();
  console.log('this guitar:', self.neck);


}]);
