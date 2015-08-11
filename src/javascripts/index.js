var app = angular.module('GameTime', ['ui.router', 'firebase', 'timer']);

app.run(function ($rootScope, $state, $log) {
  $rootScope.$on('$stateChangeError', function () {
    // Redirect user to our login page
    $state.go('login');
  });
});

app.constant('URL', {
  'SERVER': '//dw-game-time.herokuapp.com',
  'FIREBASE': '//dw-game-time.firebaseio.com'
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
    })
    .state('settings', {
      url: '/settings',
      templateUrl: './templates/settings.html',
      controller: "SettingsCtrl"
    })
    .state('messages', {
      url: '/messages',
      templateUrl: './templates/messages.html',
      controller: "SettingsCtrl"
    })
    .state('directory', {
      url: '/directory',
      templateUrl: './templates/directory.html',
      controller: "DirectoryCtrl"
    });
});

$(".button-collapse").sideNav();
