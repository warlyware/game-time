angular.module('GameTime')
.controller('NavCtrl', function($scope, $state, $rootScope) {
  console.log('NavCtrl loaded.');

  $rootScope.currentUser = {
    username: 'uSErName2531',
    sc2: 'Sc2NAme',
    image : 'http://placehold.it/250x250',
    playStyle: 'Highly Competitive',
    feedback: {
      positive: 80,
      negative: 20
    },
    endorsements: {
      friendly: 15,
      teamPlayer: 8,
      punctual: -5
    }
  }

  $scope.hideNav = function() {
    $('.button-collapse').sideNav('hide');
  }
});
