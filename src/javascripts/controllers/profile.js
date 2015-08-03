angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $rootScope, $state, $stateParams, $http, URL) {
  console.log('ProfileCtrl loaded.');

  $scope.playStyle = 1;

  $http.get(URL.server + '/user/' + $stateParams.id)
    .success(function(data) {
      console.log('user: ', data);
      $rootScope.user = data;
    })
    .error(function(err) {
      console.log(err);
    })
});
