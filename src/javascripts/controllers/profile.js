angular.module('GameTime')
.controller('ProfileCtrl', function($scope, $rootScope, $state, $stateParams, $http, URL) {
  console.log('ProfileCtrl loaded.');

  $http.get(URL.SERVER + '/user/' + $stateParams.id)
    .success(function(data) {
      console.log('user: ', data);
      $scope.user = data;
      $scope.endorsements = data.endorsements;
      $http.get(URL.SERVER + '/sc2data/' + $scope.user.sc2id + '/' + $scope.user.sc2)
        .success(function(sc2data) {
          $scope.sc2data = sc2data;
          console.log(sc2data);
      });
      $http.get(URL.SERVER + '/loldata/' + $scope.user.lol)
        .success(function(loldata) {
          $scope.loldata = loldata;
          $scope.loltotalgames = Number(loldata.wins) + Number(loldata.losses);
        })
        .error(function(err) {
          console.log(err);
        })
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
      swal("Thanks!", "Your message has been sent: " + inputValue, "success"); });
  }

  $scope.endorse = function(endorsement, val) {
    console.log('endorse ' + endorsement + ' to ' + (val+1));
  }

});
