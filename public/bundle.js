var app = angular.module('GameTime', ['ui.router']);

app.run(function() {
  console.log('Gametime online');
});


$(".button-collapse").sideNav();

angular.module('GameTime')
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl loaded.')
});
