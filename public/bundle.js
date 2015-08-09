var app = angular.module('GameTime', ['ui.router', 'firebase']);

app.run(function ($rootScope, $state, $log) {
  $rootScope.$on('$stateChangeError', function () {
    // Redirect user to our login page
    $state.go('login');
  });
});

app.constant('URL', {
  'SERVER': 'http://localhost:3000',
  'FIREBASE': 'https://dw-game-time.firebaseio.com'
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
        url: '/',
        templateUrl: './templates/home.html',
        controller: "HomeCtrl"
    })
    .state('login', {
      url: '/login',
      templateUrl: './templates/login.html',
      controller: "AuthCtrl"
    })
    .state('register', {
      url: '/register',
      templateUrl: './templates/register.html',
      controller: "AuthCtrl"
    })
    .state('profile', {
      url: '/profile/:id',
      templateUrl: './templates/profile.html',
      controller: "ProfileCtrl"
    })
    .state('settings', {
      url: '/settings',
      templateUrl: './templates/settings.html',
      controller: "SettingsCtrl"
    })
    .state('messages', {
      url: '/messages',
      templateUrl: './templates/messages.html',
      controller: "SettingsCtrl"
    })
    .state('directory', {
      url: '/directory',
      templateUrl: './templates/directory.html',
      controller: "DirectoryCtrl"
    });
});

$(".button-collapse").sideNav();

angular.module('GameTime')
.controller('AuthCtrl', function($scope, $state, $rootScope, $http, URL, $state, $stateParams) {
  console.log('AuthCtrl loaded.');
  var ref = new Firebase(URL.FIREBASE);


  $scope.registerUser = function() {
    var primaryUsername;

    if ($scope.user.primary === 'sc2') {
      primaryUsername = $scope.user.sc2;
    } else if ($scope.user.primary === 'lol') {
      primaryUsername = $scope.user.lol;
    }

    ref.createUser({
      email: $scope.user.email,
      password: $scope.user.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $http.post(URL.SERVER + '/user',
          {
            email: $scope.user.email,
            uid: userData.uid,
            sc2: $scope.user.sc2,
            sc2id: $scope.user.sc2id,
            lol: $scope.user.lol,
            primaryUsername: primaryUsername,
            fbid: userData.uid,
            playStyle: $scope.user.playStyle,
          })
          .success(function(newUser) {
            console.log('posted to backend:' + newUser.email);
            swal({
              title: 'registered!',
              text: 'you can now login',
              type: 'success'
            }, function() {
              $state.go('login');
            });
          });
      }
    });
  }

  $scope.loginUser = function() {
    ref.authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $http.get(URL.SERVER + '/user/login/' + authData.uid)
          .success(function(data) {
            localStorage.setItem('fbToken', authData.token);
            $rootScope.currentUser = data;
            console.log('currentUser: ', data);
            $state.go('directory');
          })
          .error(function(err) {
            console.log(err);
          });
          console.log("Authenticated successfully with payload:", authData);
      }
    });
  }


});

angular.module('GameTime')
.controller('DirectoryCtrl', function($scope, $state, $http, URL) {



  console.log('DirectoryCtrl loaded.');
  $http.get(URL.SERVER + '/user')
    .success(function(users) {
      console.log(users);
      $scope.users = users;
    })
    .error(function(err) {
      console.log(err);
    })

});

angular.module('GameTime')
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl loaded.');
});

angular.module('GameTime')
.controller('NavCtrl', function($scope, $state, $rootScope, $http, $window, URL) {
  var ref = new Firebase(URL.FIREBASE);

  console.log('NavCtrl loaded.');
  var ref = new Firebase(URL.FIREBASE);

  // Check if session info exits, and login if so
  if (localStorage.getItem('fbToken')) {
    var fbToken = localStorage.getItem('fbToken');
    ref.authWithCustomToken(fbToken, function(error, result) {
      if (error) {
        console.log("Authentication Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", result);
        console.log("Auth expires at:", new Date(result.expires * 1000));
        $http.get(URL.SERVER + '/user/login/' + result.uid)
          .success(function(data) {
            $rootScope.currentUser = data;
            console.log('currentUser: ', data);
          })
          .error(function(err) {
            console.log(err);
          });
      }
    });
  }

  // $rootScope.currentUser = {
  //   username: 'uSErName2531',
  //   sc2: 'Sc2NAme',
  //   image : 'http://placehold.it/250x250',
  //   playStyle: 'Highly Competitive',
  //   feedback: {
  //     positive: 80,
  //     negative: 20
  //   },
  //   endorsements: {
  //     friendly: 15,
  //     teamPlayer: 8,
  //     punctual: -5
  //   }
  // }

  $scope.logoutUser = function() {
    ref.unauth();
    $scope.hideNav();
    localStorage.removeItem('fbToken');
    $window.location.reload();
  }

  $scope.hideNav = function() {
    $('.button-collapse').sideNav('hide');
  }
});

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
            console.log(sc2data);
        });
      }
      if (user.lol) {
        $http.get(URL.SERVER + '/loldata/' + $scope.user.lol)
          .success(function(loldata) {
            $scope.loldata = loldata;
            $scope.loltotalgames = Number(loldata.wins) + Number(loldata.losses);
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
        swal("Thanks!", "Your message has been sent: " + inputValue, "success"); });
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

  getUser = function() {
    $http.get(URL.SERVER + '/user/' + $rootScope.currentUser.md5)
      .success(function(data) {
        $rootScope.currentUser = data;
      })
      .error(function(err) {
        console.error(err);
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

  angular.element(document).ready(function() {
    if (!$rootScope.currentUser) {
      setTimeout(function() {
        getMatches();
        getUser();
      }, 1200);
    } else {
      getMatches();
      getUser();
    }
  })


});
