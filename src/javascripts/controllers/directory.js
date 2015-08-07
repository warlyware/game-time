angular.module('GameTime')
.controller('DirectoryCtrl', function($scope, $state, $http, URL) {
  console.log('DirectoryCtrl loaded.');
  $http.get(URL.SERVER + '/user')
    .success(function(users) {
      console.log(users);
      $scope.users = users;
    })
    .error(function(err) {
      console.log(err);
    })
});
