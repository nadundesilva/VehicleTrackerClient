angular.module('app.controllers', ['ngCordova'])

.controller('mainCtrl', function($scope, $ionicLoading) {
  $scope.showLoadingOverlay = function(loadingText) {
    if (loadingText == null) {
      loadingText = 'Loading';
    }
    loadingText += '...';
    $ionicLoading.show({
      template: '<p>' + loadingText + '</p><ion-spinner icon="android"></ion-spinner>'
    });
  };

  $scope.hideLoadingOverlay = function(){
    $ionicLoading.hide();
  };
})

.controller('loginCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $ionicPlatform, $cordovaToast, $ionicHistory, $state) {
  $scope.credentials = {};
  $scope.login = function() {
    if ($scope.credentials.username == null || $scope.credentials.password == null) {
      $cordovaToast.showShortBottom('Username and password are required');
    } else {
      $scope.showLoadingOverlay('Logging in');
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
          } else if (response.data.status == 'USER_NOT_REGISTERED') {
            $cordovaToast.showShortBottom('Invalid username');
          } else if (response.data.status == 'USER_WRONG_PASSWORD') {
            $cordovaToast.showShortBottom('Invalid password');
          } else if (response.data.status == 'USER_NOT_VERIFIED') {
            $cordovaToast.showShortBottom('Account had not been verified');
          } else if (response.data.status == 'USER_NOT_ACTIVE') {
            $cordovaToast.showShortBottom('Account had been deactivate');
          } else {
            $cordovaToast.showShortBottom('Unknown error');
          }
          $scope.hideLoadingOverlay();
        }, function(response) {
          $cordovaToast.showShortBottom('Connection error');
          $scope.hideLoadingOverlay();
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
      });
    $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
      .success(function (value) {
        $scope.credentials.username = value;
        $cordovaPreferences.fetch($rootScope.PASSWORD_KEY)
          .success(function (value) {
            $scope.credentials.password = value;
            if ($scope.credentials.username != null && $scope.credentials.password != null) {
              $scope.login();
            }
          });
      });
  });
})

.controller('signUpCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  $scope.user = {};
    $scope.signUp = function() {
      if ($scope.user.username == null ||
        $scope.user.first_name == null ||
        $scope.user.email == null ||
        $scope.user.password == null ||
        $scope.user.confirm_password == null) {
          $cordovaToast.showShortBottom('Username, first name, last name, email and password are required');
      } else if ($scope.user.password != $scope.user.confirm_password) {
        $cordovaToast.showShortBottom('Password and confirm password do not match');
      } else {
        $scope.showLoadingOverlay('Signing up');
        $http.post($rootScope.MAIN_SERVER_URL + '/sign-up', { user: $scope.user })
          .then(function (response) {
            if (response.data.status == 'SUCCESS') {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $cordovaToast.showShortBottom('Sign up successful');
              $state.go('login', {}, {location: "replace", reload: true});
            } else if (response.data.status == 'USER_DUPLICATE_USERNAME') {
              $cordovaToast.showShortBottom('Username already exists');
            } else if (response.data.status == 'USER_DUPLICATE_EMAIL') {
              $cordovaToast.showShortBottom('Email already exists');
            } else if (response.data.status == 'USER_ALREADY_LOGGED_IN') {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $cordovaToast.showShortBottom('You are already logged in');
              $state.go('menu.home', {}, {location: "replace", reload: true});
            } else {
              $cordovaToast.showShortBottom('Unknown error');
            }
            $scope.hideLoadingOverlay();
          }, function(response) {
            $cordovaToast.showShortBottom('Connection error');
            $scope.hideLoadingOverlay();
          });
      }
    }
})

.controller('menuCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  $scope.$on('$ionicView.enter', function() {
    $cordovaPreferences.fetch($rootScope.ONLINE_MODE_KEY)
      .success(function (value) {
        $scope.loginVisible = !value;
      });
  });

  $scope.logout = function() {
    $scope.showLoadingOverlay('Logging out');
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
        } else {
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
      }, function(response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
  };
})

.controller('addVehicleCtrl', function($scope, $rootScope, $http, $cordovaToast, $ionicHistory, $state) {
  $scope.vehicle = {};
  $scope.addVehicle = function() {
    if ($scope.vehicle.name == null ||
      $scope.vehicle.license_plate == null ||
      $scope.vehicle.fuel_one == null ||
      ($scope.vehicle.bi_fuel && $scope.vehicle.fuel_two == null) ||
      $scope.vehicle.make == null ||
      $scope.vehicle.model == null ||
      $scope.vehicle.year == null) {
        $cordovaToast.showShortBottom('Name, license plate, fuel type, make, model and year are required');
    } else {
      $scope.showLoadingOverlay('Creating vehicle');
      $http.post($rootScope.MAIN_SERVER_URL + '/vehicle/create')
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            $cordovaToast.showShortBottom('Vehicle creation successful');
            $ionicHistory.backView().go();
          } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $cordovaToast.showShortBottom('You have to login first');
            $state.go('menu.home', {}, {location: "replace", reload: true});
          } else if (response.data.status == 'VEHICLE_DUPLICATE_LICENSE_PLATE_NO') {
            $cordovaToast.showShortBottom('License plate number already exists');
          } else {
            $cordovaToast.showShortBottom('Unknown error');
          }
          $scope.hideLoadingOverlay();
        }, function(response) {
          $cordovaToast.showShortBottom('Connection error');
          $scope.hideLoadingOverlay();
        });
    }
  }
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

});
