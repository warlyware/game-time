angular.module('GameTime')
.controller('SettingsCtrl', function($scope, $rootScope, $http, $state, URL) {
  //
  $scope.declineMatch = function(match) {
    console.log('declining match', match._id);
    var invitedMd5 = $rootScope.currentUser.md5;
    $http.delete(URL.SERVER + '/match/decline/' + invitedMd5 + '/' + match._id).success(function() {
      $state.reload();
    })
  }

  $scope.cancelMatch = function(match) {
    console.log('canceling match', match._id);
    var md5 = $rootScope.currentUser.md5;
    $http.delete(URL.SERVER + '/match/cancel/' + md5 + '/' + match._id).success(function() {
      $state.reload();
    })
  }

  $scope.acceptMatch = function(match) {
    console.log('accepting match', match);
    $http.patch(URL.SERVER + '/match', {
      matchId: match._id
    })
    .success(function(savedMatch) {
      console.log('saved match', savedMatch);
    });
  }


  // Get match requests
  $scope.getMatches = function() {
    $http.get(URL.SERVER + '/match/sent/' + $rootScope.currentUser.md5)
      .success(function(data) {
        $scope.requestedMatches = data;
      })
      .error(function(err) {
        console.error(err);
      });

    $http.get(URL.SERVER + '/match/received/' + $rootScope.currentUser.md5)
      .success(function(matches) {
        console.log(matches);
        $scope.acceptedMatches = matches.accepted;
        $scope.receivedMatches = matches.received;
      });
  }

  $scope.updateUser = function() {
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

  angular.element(document).ready(function() {
    setTimeout(function() {
      $scope.getMatches();
    }, 1200);
  })


});
