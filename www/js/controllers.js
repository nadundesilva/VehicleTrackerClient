angular.module('app.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  $scope.logout = function() {
    $http.get($rootScope.MAIN_SERVER_URL + '/logout')
      .then(function(response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaPreferences.remove($rootScope.USERNAME_KEY);
          $cordovaPreferences.remove($rootScope.PASSWORD_KEY);
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
    if ($scope.credentials.username.length <= 0 || $scope.credentials.password.length <= 0) {
      $cordovaToast.showShortBottom('The username and the password is required');
      return;
    }
    var data = {
      username: $scope.credentials.username,
      password: $scope.credentials.password
    };
    $http.post($rootScope.MAIN_SERVER_URL + '/login', data)
      .then(function(response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaPreferences.store($rootScope.USERNAME_KEY, $scope.credentials.username);
          $cordovaPreferences.store($rootScope.PASSWORD_KEY, $scope.credentials.password);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('Login successful');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else if (response.data.status == 'NOT_REGISTERED') {
          $cordovaToast.showShortBottom('Invalid username');
        } else if (response.data.status == 'WRONG_PASSWORD') {
          $cordovaToast.showShortBottom('Invalid password');
        }
      });
  };

  $ionicPlatform.ready(function() {
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

.controller('signUpCtrl', function($scope, $state) {
    $scope.signUp = function() {
        $state.go('menu.home');
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
