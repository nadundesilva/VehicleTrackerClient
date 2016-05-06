angular.module('app.controllers')

.controller('menuCtrl', function($scope, $rootScope, $http, $cordovaPreferences, $cordovaToast, $ionicHistory, $state) {
  // Initializing variables
  $scope.isExpanded = false;
  $scope.hasHeaderFabLeft = false;
  $scope.hasHeaderFabRight = false;
  $scope.app_name = $rootScope.APP_NAME;

  /*
   * Making the logout button or leave button visible
   */
  $scope.$on('$ionicView.enter', function() {
    $cordovaPreferences.fetch($rootScope.ONLINE_MODE_KEY)
      .success(function (value) {
        $scope.logoutVisible = value;
      });
  });

  /*
   * Marking the visited link active
   */
  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
    navIcons.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  $scope.leaveOfflineMode = function() {
    $cordovaPreferences.remove($rootScope.ONLINE_MODE_KEY);
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('menu.login', {}, {location: "replace", reload: true});
  };

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
          $state.go('menu.login', {}, {location: "replace", reload: true});
        } else {
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
      }, function(response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
  };
});
