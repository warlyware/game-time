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
