angular.module('app.controllers')

.controller('loginCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $ionicPlatform, $cordovaToast, $ionicHistory, $state, $timeout, ionicMaterialInk) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.credentials = {};
    $scope.app_name = $rootScope.APP_NAME;

    // Updating the view
    $timeout(function () {
      $scope.hideHeader();
    }, 0);
    $scope.clearFabs(0, 0);
    ionicMaterialInk.displayEffect();
  });

  /*
   * Initialization after platform had finished loading
   * This wil check if the user had entered the offline mode or had logged into the system before
   * If the user had worked in offline mode before the application will enter the offline mode
   * If the user had logged in before this will automatically login the user using the previous credentials
   */
  $ionicPlatform.ready(function() {
    // Checks if the offline mode was used previously
    $cordovaPreferences.fetch($rootScope.ONLINE_MODE_KEY)
      .success(function (value) {
        if (value != null && !value) { // Checking if the user had used the offline mode in the last login
          // Going to the home page
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('menu.home', {}, {location: "replace", reload: true});
        }
      });

    // Retrieved the username and password to login if the user had logged in before
    $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
      .success(function (value) {
        $scope.credentials.username = value;
        $cordovaPreferences.fetch($rootScope.PASSWORD_KEY)
          .success(function (value) {
            $scope.credentials.password = value;
            if ($scope.credentials.username != null && $scope.credentials.password != null) {
              // For adjusting the md ion input input bug
              var e = document.getElementsByClassName('item item-input item-md-label ng-valid');
              for(var i = 0; i < e.length; i++) {
                e[i].click();
              }

              // Logging into the system
              $scope.login();
            }
          })
          .error(function (error) {
            $scope.credentials.username = null; // Fetched username also  removed due to error in password
            $cordovaPreferences.remove($rootScope.USERNAME_KEY);
          });
      });
  });

  /*
  * Logs into the system
  * Sends a request to the server to login
  * Credentials will be saved so that the user can be automatically logged into the system next time
  * This will automatically enable the online mode
  * Application will be connecting with the server in the online mode
  */
  $scope.login = function() {
    if ($scope.credentials.username == null || $scope.credentials.password == null) { // Validations
      $cordovaToast.showShortBottom('Username and password are required');
    } else {
      $scope.showLoadingOverlay('Logging in');
      $http.post($rootScope.MAIN_SERVER_URL + '/login', {user: $scope.credentials})
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            // Storing the username, password and the mode as online mode
            $cordovaPreferences.store($rootScope.USERNAME_KEY, $scope.credentials.username);
            $cordovaPreferences.store($rootScope.PASSWORD_KEY, $scope.credentials.password);
            $cordovaPreferences.store($rootScope.ONLINE_MODE_KEY, true);

            // Going to the home page
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
        }, function (response) {
          $cordovaToast.showShortBottom('Connection error');
          $scope.hideLoadingOverlay();
        });
    }
  };

  /*
  * Enters the offline mode
  * There will be no connection with the server in the offline mode
  */
  $scope.workOffline = function() {
    // Storing the mode as offline mode
    $cordovaPreferences.store($rootScope.ONLINE_MODE_KEY, false);

    // Going to the home page
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $cordovaToast.showShortBottom('Offline mode activated');
    $state.go('menu.home', {}, {location: "replace", reload: true});
  };
});
