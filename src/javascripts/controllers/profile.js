angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $rootScope, $state, $stateParams, $http, URL) {
  console.log('ProfileCtrl loaded.');


  $http.get(URL.SERVER + '/user/' + $stateParams.id)
    .success(function(data) {
      console.log('user: ', data);
      $scope.user = data;
    })
    .error(function(err) {
      console.log(err);
    });
});
