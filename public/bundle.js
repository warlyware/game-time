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
    })
    .state('directory', {
      url: '/directory',
      templateUrl: './templates/directory.html',
      controller: "DirectoryCtrl"
    });
});

$(".button-collapse").sideNav();

angular.module('GameTime')
.controller('AuthCtrl', function($scope, $state) {
  console.log('AuthCtrl loaded.');
  var ref = new Firebase("https://dw-game-time.firebaseio.com");

  $scope.registerUser = function() {
    console.log('registerUser')
    ref.createUser({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });
  }

  $scope.loginUser = function() {
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }


});

angular.module('GameTime')
.controller('DirectoryCtrl', function($scope, $state) {
  console.log('DirectoryCtrl loaded.');
});

angular.module('GameTime')
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl loaded.')
});

angular.module('GameTime')
.controller('NavCtrl', function($scope, $state, $rootScope) {
  console.log('NavCtrl loaded.');

  $rootScope.currentUser = {
    username: 'uSErName2531',
    img: 'http://placehold.it/250x250',
    playStyle: 'Highly Competitive',
    feedback: {
      positive: 80,
      negative: 20
    },
    endorsements: {
      friendly: 15,
      teamPlayer: 8,
      punctual: -5
    }
  }

  $scope.hideNav = function() {
    $('.button-collapse').sideNav('hide');
  }
});

angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $state, $stateParams) {
  console.log('ProfileCtrl loaded.');
  $scope.userId = $stateParams.id;
});
