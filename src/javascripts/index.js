var app = angular.module('GameTime', ['ui.router']);

app.run(function() {
  console.log('Gametime online');
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
        url: '/',
        templateUrl: './templates/home.html',
        controller: "HomeCtrl"
    })
    .state('login', {
      url: '/login',
      templateUrl: './templates/login.html',
      controller: "AuthCtrl"
    })
    .state('register', {
      url: '/register',
      templateUrl: './templates/register.html',
      controller: "AuthCtrl"
    })
    .state('profile', {
      url: '/profile/:id',
      templateUrl: './templates/profile.html',
      controller: "ProfileCtrl"
    });
});

$(".button-collapse").sideNav();
