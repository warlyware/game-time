angular.module('GameTime')
.controller('SettingsCtrl', function($scope, $rootScope, $http, $state, URL) {

  $.ready(function() {

    $http.get(URL.SERVER = '/user/' + $rootScope.currentUser.md5)
      .success(function(msgData) {
        console.log(msgData);
        $scope.messages = msgData;
      })
      .error(function(err) {
        console.error(err);
      });

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
});
