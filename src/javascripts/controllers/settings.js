angular.module('GameTime')
.controller('SettingsCtrl', function($scope, $rootScope, $http, $state, $window, URL) {
  //

  $scope.declineMatch = function(match) {
    console.log('declining match', match._id);
    var invitedMd5 = $rootScope.currentUser.md5;
    $http.delete(URL.SERVER + '/match/decline/' + invitedMd5 + '/' + match._id).success(function() {

      var msgBody = 'Your match with ' + match.receiver + ' to play ' + match.game + ' on ' + match.formattedTime + ' has been declined';
      $http.post(URL.SERVER + '/message', {
        sender: 'System',
        body: msgBody,
        md5: match.originMd5
      })
      .success(function(data) {
        swal("Thanks!", "Your match request was cancelled", "success"); });
        swal({
          title: 'declined!',
          text: 'match request with ' + match.sender + ' has been declined',
          type: 'success'
        }, function() {
          $state.reload();
        });
    });
  }

  $scope.cancelMatch = function(match) {
    console.log('canceling match', match._id);
    var md5 = $rootScope.currentUser.md5;
    $http.delete(URL.SERVER + '/match/cancel/' + md5 + '/' + match._id).success(function() {
      var msgBody = match.sender + ' has cancelled the request to play ' + match.game + ' on ' + match.formattedTime
      $http.post(URL.SERVER + '/message', {
        sender: 'System',
        body: msgBody,
        md5: match.invitedMd5
      })
      .success(function(data) {
        swal({
          title: 'cancelled!',
          text: 'cancelled your match with ' + match.receiver,
          type: 'success'
        }, function() {
          $state.reload();
        });
      });
    });
  }

  $scope.acceptMatch = function(match) {
    console.log('accepting match', match);
    $http.patch(URL.SERVER + '/match', {
      matchId: match._id
    })
    .success(function(savedMatch) {

      var msgBody = 'Your match with ' + match.receiver + ' to play ' + match.game + ' on ' + match.formattedTime + ' has been accepted';
      $http.post(URL.SERVER + '/message', {
        sender: 'System',
        body: msgBody,
        md5: match.originMd5
      }).success(function() {
        swal({
          title: 'match accepted!',
          text: 'accepted request to play ' + match.sender + ' in ' + match.game,
          type: 'success'
        }, function() {
          $state.reload();
        });

      });
    });
  }


  // Get match requests
  getMatches = function() {
    var acceptedMatchesArray = [];
    var receivedMatchesArray = [];
    var requestedMatchesArray = [];

    $http.get(URL.SERVER + '/match/sent/' + $rootScope.currentUser.md5)
      .success(function(matches) {
        acceptedMatchesArray.push(matches.accepted);
        requestedMatchesArray.push(matches.received);
        $http.get(URL.SERVER + '/match/received/' + $rootScope.currentUser.md5)
          .success(function(matches2) {
            console.log('array ' + matches2.accepted);
            acceptedMatchesArray.push(matches2.accepted);
            receivedMatchesArray.push(matches2.received);
            $scope.acceptedMatches = acceptedMatchesArray;
            $scope.requestedMatches = requestedMatchesArray;
            $scope.receivedMatches = receivedMatchesArray;

            $http.get(URL.SERVER + '/user/' + $rootScope.currentUser.md5)
              .success(function(data) {
                $rootScope.currentUser = data;
                // $scope.$apply();
              })
              .error(function(err) {
                console.error(err);
              });
          });
      })
      .error(function(err) {
        console.error(err);
      });
  }

  getUser = function() {

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

  $scope.deleteMessage = function(message) {
    console.log(message);
    var userId = $scope.currentUser.md5;
    $http.delete(URL.SERVER + '/message/' + userId + '/' + message._id)
      .success(function(user) {
        // REPLACE WITH TOAST
        console.log(user);
        swal({
          title: 'deleted',
          text: 'message deleted',
          type: 'success'
        }, function() {
          $scope.currentUser.messages = user.messages;
          $scope.$apply();
          // $state.reload();
        });
      })
  }



    // $("#fakeLoader").fakeLoader({
    //   timeToHide:1300, //Time in milliseconds for fakeLoader disappear
    //   zIndex:"999",//Default zIndex
    //   spinner:"spinner2",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
    //   bgColor:"#099688" //Hex, RGB or RGBA colors
    // });
  if (!$rootScope.currentUser) {
    setTimeout(function() {
      getMatches();
      getUser();
    }, 1200);
  } else {
    getMatches();
    getUser();
  }


});
