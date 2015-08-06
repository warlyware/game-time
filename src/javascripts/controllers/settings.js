angular.module('GameTime')
.controller('SettingsCtrl', function($scope, $rootScope, $http, $state, URL) {
  $scope.updateUser = function() {
    console.log('updating user');
    $http.patch(URL.SERVER + '/user', {
      md5: $scope.currentUser.md5,
      image: $scope.user.newImage,
      playStyle: $scope.user.playStyle
    }).success(function() {
      $scope.currentUser.image = $scope.user.newImage;
      $scope.currentUser.playStyle = $scope.user.playStyle;
      swal({
        title: 'saved!',
        text: 'your settings have been saved to your profile',
        type: 'success'
      }, function() {
      });
    }).error(function(err) {
      console.log(err);
    });
  }
});
