angular.module('GameTime')
.controller('AuthCtrl', function($scope, $state, $http, URL) {
  console.log('AuthCtrl loaded.');
  var ref = new Firebase(URL.FIREBASE);

  $scope.registerUser = function() {
    var primaryUsername;

    if ($scope.user.primary === 'battleNet') {
      console.log('battleNet');
      primaryUsername = $scope.user.battleNet;
    } else if ($scope.user.primary === 'lol') {
      console.log('lol');
      primaryUsername = $scope.user.lol;
    }
    console.log('registerUser');
    // $http.get(URL.SERVER + '/user/' + $stateParams.id)
    //   .success(function(data) {
    //     console.log('user: ', data);
    //     $rootScope.user = data;
    //   })
    //   .error(function(err) {
    //     console.log(err);
    //
    // })
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
            battleNet: $scope.user.battleNet,
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
