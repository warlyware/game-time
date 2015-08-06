angular.module('GameTime')
.controller('NavCtrl', function($scope, $state, $rootScope, $http, $window, URL) {
  var ref = new Firebase(URL.FIREBASE);

  console.log('NavCtrl loaded.');
  var ref = new Firebase(URL.FIREBASE);

  // Check if session info exits, and login if so
  if (localStorage.getItem('fbToken')) {
    var fbToken = localStorage.getItem('fbToken');
    ref.authWithCustomToken(fbToken, function(error, result) {
      if (error) {
        console.log("Authentication Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", result);
        console.log("Auth expires at:", new Date(result.expires * 1000));
        $http.get(URL.SERVER + '/user/login/' + result.uid)
          .success(function(data) {
            $rootScope.currentUser = data;
            console.log('currentUser: ', data);
          })
          .error(function(err) {
            console.log(err);
          });
      }
    });
  }

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

  $scope.logoutUser = function() {
    ref.unauth();
    $scope.hideNav();
    localStorage.removeItem('fbToken');
    $window.location.reload();
  }

  $scope.hideNav = function() {
    $('.button-collapse').sideNav('hide');
  }
});
