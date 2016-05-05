angular.module('app.controllers')

.controller('vehicleCtrl', function($stateParams, $scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $cordovaPreferences) {
  $scope.mode = $stateParams.mode;
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showLoadingOverlay('Retrieving Information');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/get/' + $stateParams.license_plate_no)
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.vehicle = response.data.vehicle;
          $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
            .success(function (value) {
              if(value == $scope.vehicle.owner) {
                $scope.vehicle.owner = null;
              }
            });
        } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('You have to login first');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else {
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
      }, function (response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
  });
});
