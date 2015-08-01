var app = angular.module('GameTime', ['ui.router']);

app.run(function() {
  console.log('Gametime online');
});

$(".button-collapse").sideNav();
