angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $rootScope, $state, $stateParams, $http, URL) {
  console.log('ProfileCtrl loaded.');

  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });


  $(function() {
    $( "#datepicker" ).datepicker();
  });

  $http.get(URL.SERVER + '/user/' + $stateParams.id)
    .success(function(user) {
      console.log('user: ', user);
      $scope.user = user;
      $scope.endorsements = user.endorsements;
      $scope.feedbacks = user.feedbacks;
      console.log(user);
      if (user.sc2) {
        $http.get(URL.SERVER + '/sc2data/' + $scope.user.sc2id + '/' + $scope.user.sc2)
          .success(function(sc2data) {
            $scope.sc2data = sc2data;
            $scope.sc2wins = sc2data.career.protossWins + sc2data.career.zergWins + sc2data.career.terranWins;
            $scope.sc2losses = sc2data.career.seasonTotalGames - $scope.sc2wins;
            console.log(sc2data);
            $(function () {
                $('#sc2WinLoss').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    series: [{
                        name: user.sc2,
                        data: [{
                          name: 'wins',
                          y: $scope.sc2wins
                        }, {
                          name: 'losses',
                          y: $scope.sc2losses
                        }]
                    }]
                });
            });
        });
      }
      if (user.lol) {
        $http.get(URL.SERVER + '/loldata/' + $scope.user.lol)
          .success(function(loldata) {
            $scope.loldata = loldata;
            $scope.loltotalgames = Number(loldata.wins) + Number(loldata.losses);
            $(function () {
                $('#lolWinLoss').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    series: [{
                        name: user.lol,
                        data: [{
                          name: 'wins',
                          y: Number(loldata.wins)
                        }, {
                          name: 'losses',
                          y: Number(loldata.losses)
                        }]
                    }]
                });
            });
          })
          .error(function(err) {
            console.log(err);
          });

          $http.get(URL.SERVER + '/loldata/' + $scope.user.lol + '/heroes')
            .success(function(lolHeroes) {
              console.log(lolHeroes);
              $scope.lolHeroes = lolHeroes;
            })
            .error(function(err) {
              console.log(err);
            });
      }

    })
    .error(function(err) {
      console.log(err);
    });

  $scope.openMessageModal = function() {
    swal({
      title: "your message",
      text: "your message to " + $scope.user.primaryUsername + ':',
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Write something"
    }, function(inputValue){
      if (inputValue === false) return false;
      if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      $http.post(URL.SERVER + '/message', {
        sender: $rootScope.currentUser.primaryUsername,
        body: inputValue,
        md5: $scope.user.md5
      })
      .success(function(data) {
        Materialize.toast('message sent!', 4000)
        // swal("Thanks!", "Your message has been sent: " + inputValue, "success"); });
      });
  }

  $scope.submitFeedback = function() {
    $http.post(URL.SERVER + '/feedback', {
      poster: $rootScope.currentUser.primaryUsername,
      body: $scope.feedback.body,
      feedbackVal: $scope.feedbackVal,
      md5: $scope.user.md5
    })
    .success(function() {
      swal({
        title: 'feedback saved!',
        text: 'thank you for submitting your feedback on ' + $scope.user.primaryUsername,
        type: 'success'
      }, function() {
        $state.reload();
      });
    })
    .error(function(err) {
      console.log(err);
    });
  }

  $scope.submitRequest = function() {
    $http.post(URL.SERVER + '/match', {
      matchTime: $scope.match.date,
      game: $scope.match.game,
      originMd5: $rootScope.currentUser.md5,
      invitedMd5: $scope.user.md5,
    })
    .success(function() {
      swal({
        title: 'gametime!',
        text: 'your request to play ' + $scope.match.game + 'has been accepted',
        type: 'success'
      }, function() {
      });
      console.log('match saved');
    })
  }

  $scope.endorse = function(endorsement, val, e) {

    $http.patch(URL.SERVER + '/user', {
      endorsement: endorsement,
      md5: $scope.user.md5
    }).success(function() {
      console.log("added 1 to " + endorsement);
      val += 1;
      setTimeout(function() {
        console.log('applying ' + e);
        $scope.$digest();
      }, 500);
    }).error(function(err) {
      console.log(err);
    });
  }

});
