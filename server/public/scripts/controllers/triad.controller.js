//$('.fretboardContainer') change r

app.controller('TriadController', ["$http", 'Factory', function($http, Factory) {
  console.log('Triad controller running');
  var self = this;
  var slider = document.getElementById('slider');

  noUiSlider.create(sliderBar, {
  	start: [20, 80],
  	connect: true,
  	range: {
  		'min': 0,
  		'max': 100
  	}
});
  self.getFrets = function() {
        self.sliderSnaps = Factory.fretMap();
        console.log('self.sliderSnaps:', self.sliderSnaps);
      };


}]);
