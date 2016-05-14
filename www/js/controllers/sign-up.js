angular.module('app.controllers')

.controller('signUpCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state, $timeout, ionicMaterialInk) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.user = {};

    // Updating the view
    $timeout(function () {
      $scope.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
  });

  /*
  * Signs up the user using the details provided
  * A user will be created in the database
  */
  $scope.signUp = function() {
    if ($scope.user.username == null ||
      $scope.user.first_name == null ||
      $scope.user.email == null ||
      $scope.user.password == null ||
      $scope.user.confirm_password == null) { // Validations
      $cordovaToast.showShortBottom('Username, first name, last name, email and password are required');
    } else if ($scope.user.password != $scope.user.confirm_password) {  // Validations
      $cordovaToast.showShortBottom('Password and confirm password do not match');
    } else {
      $scope.showLoadingOverlay('Signing up');
      $http.post($rootScope.MAIN_SERVER_URL + '/sign-up', { user: $scope.user })
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            // Going to the login page
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $cordovaToast.showShortBottom('Sign up successful');
            $state.go('menu.login', {}, {location: "replace", reload: true});
          } else if (response.data.status == 'USER_DUPLICATE_USERNAME') {
            $cordovaToast.showShortBottom('Username already exists');
          } else if (response.data.status == 'USER_DUPLICATE_EMAIL') {
            $cordovaToast.showShortBottom('Email already exists');
          } else if (response.data.status == 'USER_ALREADY_LOGGED_IN') {
            // Going to the home page
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
  };
});
