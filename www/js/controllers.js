angular.module('app.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  $scope.logout = function() {
    $http.get($rootScope.MAIN_SERVER_URL + '/logout')
      .then(function(response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaPreferences.remove($rootScope.USERNAME_KEY);
          $cordovaPreferences.remove($rootScope.PASSWORD_KEY);
          $cordovaPreferences.remove($rootScope.ONLINE_MODE_KEY);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('Logout successful');
          $state.go('login', {}, {location: "replace", reload: true});
        }
      });
  };
})

.controller('loginCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $ionicPlatform, $cordovaToast, $ionicHistory, $state) {
  $scope.credentials = {};
  $scope.login = function() {
    if ($scope.credentials.username == null || $scope.credentials.password == null) {
      $cordovaToast.showShortBottom('Username and password are required');
    } else {
      $http.post($rootScope.MAIN_SERVER_URL + '/login', { user: $scope.credentials })
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            $cordovaPreferences.store($rootScope.USERNAME_KEY, $scope.credentials.username);
            $cordovaPreferences.store($rootScope.PASSWORD_KEY, $scope.credentials.password);
            $cordovaPreferences.store($rootScope.ONLINE_MODE_KEY, true);
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $cordovaToast.showShortBottom('Login successful');
            $state.go('menu.home', {}, {location: "replace", reload: true});
          } else if (response.data.status == 'NOT_REGISTERED') {
            $cordovaToast.showShortBottom('Invalid username');
          } else if (response.data.status == 'WRONG_PASSWORD') {
            $cordovaToast.showShortBottom('Invalid password');
          } else if (response.data.status == 'NOT_VERIFIED') {
            $cordovaToast.showShortBottom('Account had not been verified');
          }
        });
    }
  };

  $scope.workOffline = function() {
    $cordovaPreferences.store($rootScope.ONLINE_MODE_KEY, false);
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $cordovaToast.showShortBottom('Offline mode activated');
    $state.go('menu.home', {}, {location: "replace", reload: true});
  };

  $ionicPlatform.ready(function() {
    $cordovaPreferences.fetch($rootScope.ONLINE_MODE_KEY)
      .success(function(value) {
        if(value != null && !value) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('menu.home', {}, {location: "replace", reload: true});
        }
      })
    $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
      .success(function (value) {
        $scope.credentials.username = value;
        $cordovaPreferences.fetch($rootScope.PASSWORD_KEY)
          .success(function (value) {
            $scope.credentials.password = value;
            $scope.login();
          });
      });
  });
})

.controller('signUpCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  $scope.user = {};
    $scope.signUp = function() {
      if ($scope.user.username == null ||
        $scope.user.first_name == null ||
        $scope.user.last_name == null ||
        $scope.user.email == null ||
        $scope.user.password == null ||
        $scope.user.confirm_password == null) {
          $cordovaToast.showShortBottom('Username, first name, last name, email and password are required');
      } else if ($scope.user.password != $scope.user.confirm_password) {
        $cordovaToast.showShortBottom('Password and confirm password do not match');
      } else {
        $http.post($rootScope.MAIN_SERVER_URL + '/register', { user: $scope.user })
          .then(function (response) {
            if (response.data.status == 'SUCCESS') {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $cordovaToast.showShortBottom('Sign up successful');
              $state.go('login', {}, {location: "replace", reload: true});
            } else if (response.data.status == 'DUPLICATE_USERNAME') {
              $cordovaToast.showShortBottom('Username already exists');
            } else if (response.data.status == 'DUPLICATE_EMAIL') {
              $cordovaToast.showShortBottom('Email already exists');
            } else if (response.data.status == 'ALREADY_LOGGED_IN') {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $cordovaToast.showShortBottom('You are already logged in');
              $state.go('menu.home', {}, {location: "replace", reload: true});
            }
          });
      }
    }
})

.controller('homeCtrl', function($scope) {

})

.controller('addFuelFillUpCtrl', function($scope) {

})

.controller('addMiscellaneousCostCtrl', function($scope) {

})

.controller('addCheckInCtrl', function($scope) {

})

.controller('vehiclesCtrl', function($scope) {

})

.controller('checkInsCtrl', function($scope) {

})

.controller('fuelFillUpsCtrl', function($scope) {

})

.controller('addVehicleCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

})

.controller('miscellaneousCostsCtrl', function($scope) {

})

.controller('generateReportCtrl', function($scope) {

})

.controller('reportCtrl', function($scope) {

})

.controller('vehicleCtrl', function($scope) {

})

.controller('checkInCtrl', function($scope) {

})

.controller('fuelFillUpCtrl', function($scope) {

})

.controller('miscellaneousCostCtrl', function($scope) {

})
