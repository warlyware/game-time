var app = angular.module('GameTime', ['ui.router', 'firebase']);

app.run(function() {
  console.log('Gametime online');
});

app.constant('URL', {
  'SERVER': 'http://localhost:3000',
  'FIREBASE': 'https://dw-game-time.firebaseio.com'
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
    .state('directory', {
      url: '/directory',
      templateUrl: './templates/directory.html',
      controller: "DirectoryCtrl"
    });
});

$(".button-collapse").sideNav();

angular.module('GameTime')
.controller('AuthCtrl', function($scope, $state, $rootScope, $http, URL, $state, $stateParams) {
  console.log('AuthCtrl loaded.');
  var ref = new Firebase(URL.FIREBASE);

  $scope.registerUser = function() {
    var primaryUsername;

    if ($scope.user.primary === 'sc2') {
      primaryUsername = $scope.user.sc2;
    } else if ($scope.user.primary === 'lol') {
      primaryUsername = $scope.user.lol;
    }

    ref.createUser({
      email: $scope.user.email,
      password: $scope.user.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $http.post(URL.SERVER + '/user',
          {
            email: $scope.user.email,
            sc2: $scope.user.sc2,
            sc2id: $scope.user.sc2id,
            lol: $scope.user.lol,
            primaryUsername: primaryUsername,
            fbid: userData.uid,
            playStyle: $scope.user.playStyle
          })
          .success(function(newUser) {
            console.log('posted to backend:' + newUser.email);
          });
      }
    });
  }

  $scope.loginUser = function() {
    ref.authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $http.get(URL.SERVER + '/user/login/' + $scope.user.email)
          .success(function(data) {
            $rootScope.currentUser = data;
            console.log('currentUser: ', data);
            $state.go('directory');
          })
          .error(function(err) {
            console.log(err);
          });
          console.log("Authenticated successfully with payload:", authData);
      }
    });
  }


});

angular.module('GameTime')
.controller('DirectoryCtrl', function($scope, $state) {
  console.log('DirectoryCtrl loaded.');
  $('#sc2filter').prop('checked');
});

angular.module('GameTime')
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl loaded.');
});

angular.module('GameTime')
.controller('NavCtrl', function($scope, $state, $rootScope) {
  console.log('NavCtrl loaded.');

  // $rootScope.currentUser = {
  //   username: 'uSErName2531',
  //   sc2: 'Sc2NAme',
  //   image : 'http://placehold.it/250x250',
  //   playStyle: 'Highly Competitive',
  //   feedback: {
  //     positive: 80,
  //     negative: 20
  //   },
  //   endorsements: {
  //     friendly: 15,
  //     teamPlayer: 8,
  //     punctual: -5
  //   }
  // }

  $scope.hideNav = function() {
    $('.button-collapse').sideNav('hide');
  }
});

angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $rootScope, $state, $stateParams, $http, URL) {
  console.log('ProfileCtrl loaded.');

  $http.get(URL.SERVER + '/user/' + $stateParams.id)
    .success(function(data) {
      console.log('user: ', data);
      $scope.user = data;
      $scope.endorsements = data.endorsements;
      $http.get(URL.SERVER + '/sc2data/' + $scope.user.sc2id + '/' + $scope.user.sc2)
        .success(function(sc2data) {
          $scope.sc2data = sc2data;
          console.log(sc2data);
      });
      $http.get(URL.SERVER + '/loldata/' + $scope.user.lol)
        .success(function(loldata) {
          $scope.loldata = loldata;
          $scope.loltotalgames = Number(loldata.wins) + Number(loldata.losses);
        })
        .error(function(err) {
          console.log(err);
        })
    })
    .error(function(err) {
      console.log(err);
    });

  $scope.openMessageModal = function() {
    swal({
      title: "your message",
      text: "your message to " + $scope.user.primaryUsername + ':',
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Write something"
    }, function(inputValue){
      if (inputValue === false) return false;
      if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      swal("Thanks!", "Your message has been sent: " + inputValue, "success"); });
  }

  $scope.endorse = function(endorsement, val) {
    console.log('endorse ' + endorsement + ' to ' + (val+1));
  }

});

angular.module('GameTime')
.controller('SettingsCtrl', function($scope, $rootScope) {
  console.log('SettingsCtrl loaded.');
});
