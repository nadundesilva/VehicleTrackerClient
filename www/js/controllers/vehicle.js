angular.module('app.controllers')

.controller('vehicleCtrl', function($stateParams, $scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $cordovaPreferences, $timeout, ionicMaterialInk, ionicMaterialMotion, sharedData) {
  // Initializing variables
  $scope.mode = $stateParams.mode;
  $scope.vehicle = {};

  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(1, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.showLoadingOverlay('Retrieving Information');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $stateParams.license_plate_no + '/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.vehicle = response.data.vehicle;
          $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
            .success(function (value) {
              if(value == $scope.vehicle.owner) {
                $scope.vehicle.owner = null;
              }
            });
          var vehicleSharedData = sharedData.getVehicleData();
          vehicleSharedData.vehicle = $scope.vehicle;
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

  $scope.$on('$ionicView.leave', function() {
    sharedData.clearVehicleData();
  });
});
