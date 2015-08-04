angular.module('GameTime')
.controller('DirectoryCtrl', function($scope, $state) {
  console.log('DirectoryCtrl loaded.');
  $('#sc2filter').prop('checked');
});
