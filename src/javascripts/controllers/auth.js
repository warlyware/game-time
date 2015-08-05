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
