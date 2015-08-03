angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $state, $stateParams) {
  console.log('ProfileCtrl loaded.');
  $scope.userId = $stateParams.id;
});
